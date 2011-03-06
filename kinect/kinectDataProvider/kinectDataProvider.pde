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
  size(640, 480);
  background(204);
  stroke(0);
  frameRate(10);

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

void keyPressed() {
  int t = tracker.getThreshold();
  if (key == CODED) {
    if (keyCode == UP) {
      t+=5;
      tracker.setThreshold(t);
    } 
    else if (keyCode == DOWN) {
      t-=5;
      tracker.setThreshold(t);
    }
  }
}

void stop() {
  tracker.quit();
  super.stop();
}

