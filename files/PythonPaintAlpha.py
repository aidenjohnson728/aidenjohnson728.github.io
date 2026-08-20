#Python Paint Alpha
#Author: Aiden Johnson
from graphics import *
import math


#First class is Color Circle, which stores information on Color Circles including color and position
class ColorCircle():
    #Color Circle instance variables 
    def __init__(self, color, outline, x, y,):
        self.radius = 20
        self.color = color 
        self.outline = outline
        self.x = x
        self.y = y
    #Draws the Color Circles using these commands   
    def draw(self, win):
        circleColor = Circle(Point(self.x, self.y), self.radius)
        circleColor.setFill(self.color)
        circleColor.setOutline(self.outline)
        circleColor.draw(win)
    #Checks if the user's input is within the bounds of the Color Circle's radius.
    #If it is, then didClick returns True and a color can then be selected.
    def didClick(self, clickX, clickY):
        distance = getDistance(self.x, self.y, clickX, clickY)
        if distance <= self.radius:
            return True 
        else:
            return False 
    #getColor will go through the list of circles and then uses didClick to pick the correct circle.
    def getColor(self, clickX, clickY, circleList):
        for circle in circleList:
            if circle.didClick(clickX, clickY):
                return circle.color
        return None
    #String method of this class, I never ended up using this.
    def __str__(self):
        return f"{self.color}, {self.x}, {self.y},"

#Second class stores a lot of information which will be used once the input of color selected and shape 
#selected come in later in the program.
class ShapeMade():
    def __init__(self, color, shape, outline, x, y):
        self.color = color 
        self.shape = shape
        self.outline = outline
        self.x = x
        self.y = y
#For each shape, a different method is called in order to properly draw the shape. I used almost the 
#same formulas as I did when creating the window, but instead I had to adjust the coordinate values to be
#able to be used at any point instead of a fixed point like they are in the window set up.
    def draw(self, color, shape, outline, x, y, win):
        if self.shape == "Line":
            line = Line(Point(self.x - 30, self.y), Point(self.x + 30, self.y))
            line.setFill(self.color)
            line.setOutline(self.outline)
            line.setWidth(7)
            line.draw(win)

        elif self.shape == "Circle":
            circle = Circle(Point(self.x, self.y), 30)
            circle.setFill(self.color)
            circle.setOutline(self.outline)
            circle.draw(win)

        elif self.shape == "Triangle":
            triangle = Polygon(Point(self.x - 25, self.y + 25), Point(self.x + 25, self.y + 25), Point(self.x, self.y - 25))
            triangle.setFill(self.color)
            triangle.setOutline(self.outline)
            triangle.draw(win)

        elif self.shape == "Square":
            square = Rectangle(Point(self.x - 30, self.y - 30), Point(self.x + 30, self.y + 30))
            square.setFill(self.color)
            square.setOutline(self.outline)
            square.draw(win)

def getDistance(x1,y1,x2,y2):
    distance = math.sqrt((x1-x2)**2 + (y1-y2)**2)
    return distance
#Records both the x and y value of a click and then returns it to be used elsewhere.

def recordClick(win):
    clickPoint = win.getMouse()
    return clickPoint.getX(), clickPoint.getY()
#Sets up the window, including the shapes I mentioned above. 

def windowSetUp():
    winWidth, winHeight = 1000,800
    win = GraphWin("Python Paint!", winWidth, winHeight)
    win.setBackground("white")
#I wanted each shape to be white with a black outline because I thought it looked better.
    lineShape = Line(Point(900, 220), Point(960, 220))
    lineShape.setWidth(7)
    lineShape.draw(win)

    circleShape = Circle(Point(930,310), 30)
    circleShape.setFill("white")
    circleShape.draw(win)

    triangleShape = Polygon(Point(905,440), Point(955,440),Point(930,390))
    triangleShape.setFill("white")
    triangleShape.draw(win)

    squareShape = Rectangle(Point(900, 500), Point(960, 560))
    squareShape.setFill("white")
    squareShape.draw(win)

    return win

def colorCircleSetUp(win):
    #colors are given in this list and are then used in the colorCircle class
    colorList = ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Purple', 'Black'] 
    circleList = []  # Create an empty list to hold ColorCircle objects
    # Create ColorCircle objects and add them to circleList
    for i in range(len(colorList)):
        colorCircle = ColorCircle(colorList[i], colorList[i], 50, 200 + (50*i))
        circleList.append(colorCircle)
        colorCircle.draw(win)
    return circleList

def getShape(clickX, clickY):
    # Checks if click point is within the bounds of the shapes on the right side. If a click is within these
    # X coordinates, then the code checks if the click is also within the y coordinates needed to 
    # Click on one of the shapes.
    if 900 <= clickX <= 1000:
        if 210 <= clickY <= 240:  # Line shape
            return 'Line'
        elif 280 <= clickY <= 340:  # Circle shape
            return 'Circle'
        elif 390 <= clickY <= 440:  # Triangle shape
            return 'Triangle'
        elif 500 <= clickY <= 560:  # Square shape
            return 'Square'
    else:
        return None
    
def pythonPaintActivate(win, circleList):

    message1 = Text(Point(515,750),"Welcome to Python Paint. First, select a color!")
    message1.setFace('helvetica')
    message1.setSize(18)
    message1.draw(win)
        
    while True:
        selectedColor = None
        selectedShape = None
        #Now we record a click in the window
        clickX, clickY = recordClick(win)
        #if the click is within these bounds, we get the color and select one
        for circle in circleList:
            if circle.didClick(clickX, clickY):
                selectedColor = circle.color
                  # Stops searching for a color once a circle is clicked
        #When we get a color, we then will select a shape. We will know to progress to shape once 
        #SelectedColor is not "None" 
        if selectedColor != None:
            message1.undraw()
            message2 = Text(Point(515,750),"Now, select a shape! Color: " + str(selectedColor))
            message2.setFace('helvetica')
            message2.setSize(18)
            message2.draw(win) 

            #Now, get the click for shape selection
            clickX, clickY = recordClick(win)
            #Using those points, we get the shape using the getShape function
            selectedShape = getShape(clickX, clickY)
            #Once selectedShape has been chosen, we go to the next thing. 
            if selectedShape != None:
                
                message2.undraw()
                message3 = Text(Point(515,750),"Now, click anywhere! Shape: " + str(selectedColor) + " " + str(selectedShape))
                message3.setFace('helvetica')
                message3.setSize(18)
                message3.draw(win) 

                #Now, we get the final click in order to draw the shape selected in the correct spot. Called clickX2 and clickY2

                clickX2, clickY2 = recordClick(win)

                #first builds shape, then draws the shape. Works!

                shapeMade = ShapeMade(selectedColor, selectedShape, selectedColor, clickX2, clickY2)
                message3.undraw()
                shapeMade.draw(selectedColor, selectedShape, selectedColor, clickX2, clickY2, win)

            else:
                message2.undraw()

        else: message1.undraw()

#Onto main! Much more chill now. Very minimalist
def main():
    win = windowSetUp()
    colorCircleSetUp(win)
    circleList = colorCircleSetUp(win)
    pythonPaintActivate(win, circleList)

main()