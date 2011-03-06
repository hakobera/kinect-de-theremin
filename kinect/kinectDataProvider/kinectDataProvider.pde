import processing.net.*;
import org.openkinect.*;
import org.openkinect.processing.*;

KinectTracker tracker;
Kinect kinect;

Client client;
String input;
int data[];
int count = 0;

void setup() {
  size(640, 520);
  background(204);
  stroke(0);
  frameRate(1);

  kinect = new Kinect(this);
  tracker = new KinectTracker();
  
  client = new Client(this, "127.0.0.1", 9999);
}

void draw() {
  tracker.track();
  tracker.display();

  PVector v2 = tracker.getLerpedPos();

  client.write(v2.x + "," + v2.y);
}


void stop() {
  tracker.quit();
  super.stop();
}

