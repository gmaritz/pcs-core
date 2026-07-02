import app from './app';
import { environment } from './config';

app.listen(environment.port, () => {
  console.log('');
  console.log('==================================================');
  console.log(` ${environment.appName}`);
  console.log('==================================================');
  console.log(
    ` Server running on http://localhost:${environment.port}`,
  );
  console.log(
    ` Health Check: http://localhost:${environment.port}/health`,
  );
  console.log(` Environment: ${environment.nodeEnv}`);
  console.log(` Version: ${environment.appVersion}`);
  console.log('==================================================');
  console.log('');
});