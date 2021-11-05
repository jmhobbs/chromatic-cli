import retry from 'async-retry';
import fs from 'fs-extra';
import progress from 'progress-stream';

export async function uploadZip(ctx, path, url, contentLength, onProgress) {
  let totalProgress = 0;

  ctx.log.debug(`Uploading ${contentLength} bytes for '${path}' to '${url}'`);

  return retry(
    async () => {
      const progressStream = progress();

      progressStream.on('progress', ({ delta }) => {
        totalProgress += delta;
        onProgress(totalProgress);
      });

      const res = await ctx.http.fetch(
        url,
        {
          method: 'PUT',
          body: fs.createReadStream(path).pipe(progressStream),
          headers: {
            'content-type': 'application/zip',
            'content-length': contentLength,
            'cache-control': 'max-age=31536000',
          },
        },
        { retries: 0 } // already retrying the whole operation
      );

      if (!res.ok) {
        ctx.log.debug(`Uploading '${path}' failed: %O`, res);
        throw new Error(path);
      }
      ctx.log.debug(`Uploaded '${path}'.`);
    },
    {
      retries: ctx.env.CHROMATIC_RETRIES,
      onRetry: (err) => {
        totalProgress = 0;
        ctx.log.debug('Retrying upload %s, %O', url, err);
        onProgress(totalProgress);
      },
    }
  );
}

export async function waitForUnpack(ctx, url) {
  ctx.log.debug(`Waiting for zip unpack sentinel file to appear at '${url}'`);

  return retry(
    async () => {
      const res = await ctx.http.fetch(url, {}, { retries: 0 });
      if (!res.ok) {
        throw new Error('Sentinel file not present.');
      }
      ctx.log.debug(`Sentinel file present, continuing.`);
    },
    {
      retries: 10,
      minTimeout: 500,
    }
  );
}
