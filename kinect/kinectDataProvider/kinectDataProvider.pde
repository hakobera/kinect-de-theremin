import processing.net.*;

Client client;
String input;
int data[];
int count = 0;

void setup() {
  size(450, 255);
  background(204);
  stroke(0);
  frameRate(1);
  client = new Client(this, "127.0.0.1", 9999);
}

void draw() {
  client.write("abc");
}

