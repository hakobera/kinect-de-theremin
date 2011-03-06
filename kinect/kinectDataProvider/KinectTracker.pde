class KinectTracker {

  int kw = 640;
  int kh = 480;
  int threshold = 600;

  PVector loc;

  PVector lerpedLoc;

  int[] depth;
  
  PImage display;

  KinectTracker() {
    kinect.start();
    kinect.enableRGB(false);
    kinect.enableDepth(true);

    kinect.processDepthImage(false);

    display = createImage(kw, kh, PConstants.RGB);

    loc = new PVector(0, 0);
    lerpedLoc = new PVector(0, 0);
  }

  void track() {
    depth = kinect.getRawDepth();

    if (depth == null) {
      return;
    }

    float sumX = 0;
    float sumY = 0;
    float count = 0;

    for (int x = 0; x < kw; ++x) {
      for (int y = 0; y < kh; y++) {
        int offset = kw - x - 1 + y * kw;
        int rawDepth = depth[offset];

        if (rawDepth < threshold) {
          sumX += x;
          sumY += y;
          count++;
        }
      }
    }

    if (count != 0) {
      loc = new PVector(sumX/count, sumY/count);
    }

    lerpedLoc.x = PApplet.lerp(lerpedLoc.x, loc.x, 0.3f);
    lerpedLoc.y = PApplet.lerp(lerpedLoc.y, loc.y, 0.3f);
  }

  PVector getLerpedPos() {
    return lerpedLoc;
  }

  PVector getPos() {
    return loc;
  }
  
  void display() {
    PImage img = kinect.getVideoImage();
    if (depth == null || img == null) {
      return;
    }
    
    display.loadPixels();
    for (int x = 0; x < kw; ++x) {
      for (int y = 0; y < kh; ++y) {
        int offset = kw - x - 1 + y * kw;
        int rawDepth = depth[offset];
        
        int pix = x + y * display.width;
        if (rawDepth < threshold) {
          display.pixels[pix] = color(150, 50, 50);
        } else {
          display.pixels[pix] = img.pixels[offset];
        }
      }
    }
    display.updatePixels();
    
    image(display, 0, 0);
  }
  
  void quit() {
    kinect.quit();
  }
  
  void setThreshold(int t) {
    threshold = t;
  }
  
  int getThreshold() {
    return threshold;
  }
  
}

