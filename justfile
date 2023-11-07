
do:
  #!/bin/bash
  npm install
  npm run build &
  npm run server &
  nginx -p $(pwd) -c ./nginx.conf &
  wait
