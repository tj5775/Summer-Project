# Import package
import paho.mqtt.client as mqtt
import time
import random

# Define Variables
MQTT_HOST = "13.57.29.105"
MQTT_PORT = 1883
MQTT_KEEPALIVE_INTERVAL = 45
MQTT_TOPIC = "61c4b89a73bba8339e58a99f"

# MQTT_MSG = '{ "ts":"1648854762","id":"2","sn":"32nd Street Booster Pump Station","lat":"134.229996","lon":"24.209999","temp": "10","mac":"00:0a:95:9d:68:01"}'
# Define on_publish event function


def on_publish(client, userdata, mid):
	print("Message Published:")


# Initiate MQTT Client
mqttc = mqtt.Client()

# Register publish callback function
mqttc.on_publish = on_publish

# Connect with MQTT Broker
mqttc.connect(MQTT_HOST, MQTT_PORT, MQTT_KEEPALIVE_INTERVAL)

# Publish message to MQTT Broker
while True:
	time.sleep(2)
	n = str(random.randint(0, 100))
	print("Random Number " + n)
	mqttc.publish(MQTT_TOPIC, '{ "randomNum":"'+n+'"}')

# Disconnect from MQTT_Broker
mqttc.disconnect()
