// Car class
class Car {
  
  // Declaring data members and methods
  private int id;
  private String model;
  private String color;

  public void carFeatures() { // Function to print out car features
    System.out.println("Car Model: " + model);
    System.out.println("Car Color: " + color);
  }
  
  public void setModel(String model) {
    this.model = model;
  }

  public void setColor(String color) {
    this.color = color;
  }
  
}

// Toyota Class, which is a child class of Car class.
class Toyota extends Car {
  
  // Inherits all properties of Car class
  public void setStart() {
    // Declaring an engine object and calling the start() function of the engine.
    ToyotaEngine engine = new ToyotaEngine();
    engine.start();
  }
  
}

// Engine class
class ToyotaEngine {
  
  // This function simply prints out on screen that Engine has been started!
  public void start() {
    System.out.println("Engine has been started.");
  }
  
  // This function simply prints out on screen that Engine has been stopped!
  public void stop() {
    System.out.println("Engine has been stopped.");
  }
  
}

class Main {

  public static void main(String[] args) {
    // Declaring and initializing Toyota object
    Toyota t = new Toyota();
    t.setModel("Fortuner");
    t.setColor("Silver");

    t.carFeatures();
    t.setStart(); 
  }
  
}