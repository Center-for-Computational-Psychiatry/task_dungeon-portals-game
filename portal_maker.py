import random
import math

class PortalMaker():
    def __init__(self, n_doors, n_floors, steps_to_solve):
        self.n_doors = n_doors
        self.n_floors = n_floors
        self.steps_to_solve = steps_to_solve
        self.portal_connections = {}

    def portal_picker(self):
        steps = 0
        reps = 0
        
        while steps != self.steps_to_solve:
            reps += 1
            assignments = self.portal_generator() # generate new set of portal connections
            portal_connections = assignments[0]
            floors_n_doors = assignments[1]
            steps = self.portal_solver(portal_connections, floors_n_doors) # solve for this set of portal connections

            if steps == self.steps_to_solve: # if it matches, return this set of portal connections
                break
            if reps >= 100:
                raise Exception("More than 100 failed attempts to find portal connections. Try different portal parameters.")
        
        # print("Portal set found!")
        # print("Steps to solve: " + str(steps))
        self.portal_connections = portal_connections
        return portal_connections
    
    def portal_generator(self):
        if self.n_doors % 2 != 0:
            raise Exception("Number of doors needs to be even.")
        # this is because every door needs a connecting door
        
        doors = list(range(self.n_doors)) # make array list of size n_doors
        doors = [i + 1 for i in doors] # add 1 to each array item to account for index zero 
        portal_connections = {}

        # for connection in range(1, n_connections):
        while len(doors) > 0:
            random.shuffle(doors)
            point_a = doors[0]
            doors.remove(point_a)
            point_b = doors[0]
            doors.remove(point_b)
            portal_connections[point_a] = point_b
            portal_connections[point_b] = point_a

        floors_n_doors = {}
        n_doorsperfloor = math.ceil(self.n_doors / self.n_floors) # round up to nearest integer
        # assign doors to each floor
        doors_list = list(range(1, self.n_doors+1))
        for floor in range(1, self.n_floors+1): # 1 thru 4 floors floorsndoors[4] = range 3*3+1, 10
            doors = doors_list[:n_doorsperfloor] 
            floors_n_doors[floor] = doors # assign doors to floor
            doors_list = doors_list[n_doorsperfloor:] # remove doors of that floor from doors_list

        assignments = [portal_connections, floors_n_doors]
        return assignments

    # EXAMPLES:
    # portal_connections: {1: 6, 6: 1, 10: 7, 7: 10, 2: 5, 5: 2, 9: 3, 3: 9, 8: 4, 4: 8}
    # floors_n_doors:     {1: [1, 2, 3], 2: [4, 5, 6], 3: [7, 8, 9], 4: [10, 11, 12]}


    def portal_solver(self, portal_connections, floors_n_doors):
        # determine all possible floor-to-floor connections
        steps_to_solve = 1
        f2f_connections = {}
        for floor in floors_n_doors:
            destination_floors = []
            for door in floors_n_doors[floor]:
                destination_door = portal_connections[door]
                destination_floor = {i for i in floors_n_doors if destination_door in floors_n_doors[i]}
                destination_floor = int(str(destination_floor).strip("{}")) # reformat from key to string to remove brackets to integer
                destination_floors.append(destination_floor)
            destination_floors = list(dict.fromkeys(destination_floors)) # remove duplicate floor numbers
            f2f_connections[floor] = destination_floors
        
        # start solving floors 
        n_floors = len(floors_n_doors)
        # goal floor should be middle, start floor one above
        # setting start/goal floors to be at the center
        goal_floor = math.floor(n_floors / 2) + 1 # should be floor 3 for 4 or 5 total floors
        start_floor = goal_floor - 1 # should be floor 2 for 4 or 5 total floors 
        
        floor_destinations = f2f_connections[start_floor] # start floor destinations
        for i in range(1, n_floors):
            if goal_floor in floor_destinations:
                return steps_to_solve
            ############
            steps_to_solve += 1 # increment by 1
            past_destinations = floor_destinations # assign to new variable
            floor_destinations = [] # clear floor_destinations for new round
            for past_floor in past_destinations: # now determine the destination floors of this floor
                ending_floors = f2f_connections[past_floor]
                for ending_floor in ending_floors:
                    floor_destinations.append(ending_floor)        
        
        return steps_to_solve


    



# portal_set = portal_picker(18, 6, 3) # 6 floors
# print("portals set: ")
# print(portal_set)