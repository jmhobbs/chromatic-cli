import fatalError from './fatalError';
import pkg from '../../../../package.json';

export default {
  title: 'CLI/Messages/Errors',
};

const stack = `Error: Oh no!
    at FatalError (http://localhost:9009/main.6eda3407d6f38d88bd8d.bundle.js:2068:24)
    at http://localhost:9009/vendors~main.6eda3407d6f38d88bd8d.bundle.js:251:21
    at http://localhost:9009/vendors~main.6eda3407d6f38d88bd8d.bundle.js:1554:16
    at http://localhost:9009/main.6eda3407d6f38d88bd8d.bundle.js:110:66
    at http://localhost:9009/vendors~main.6eda3407d6f38d88bd8d.bundle.js:251:21
    at http://localhost:9009/vendors~main.6eda3407d6f38d88bd8d.bundle.js:1553:14
    at http://localhost:9009/vendors~main.6eda3407d6f38d88bd8d.bundle.js:1554:16
    at withSubscriptionTracking (http://localhost:9009/vendors~main.6eda3407d6f38d88bd8d.bundle.js:1582:16)
    at http://localhost:9009/vendors~main.6eda3407d6f38d88bd8d.bundle.js:251:21
    at http://localhost:9009/vendors~main.6eda3407d6f38d88bd8d.bundle.js:1553:14`;

export const FatalError = () => {
  const context = { title: 'Run a job', pkg };
  const error = { message: "That's not right!", stack };
  return fatalError(context, error);
};

export const FatalErrorSimple = () => {
  const context = { title: 'Run a job', pkg };
  const error = { message: "That's not right!" };
  return fatalError(context, error);
};
