cd /opt/delauncher/delauncher
node app.js instance $INSTANCE_ID $CONFIG_FILE_PATH

/opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/server.properties
