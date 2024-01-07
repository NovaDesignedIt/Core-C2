##CONFIGURATION AND DEFINITION FILE 
import json
import random
import pprint
import requests
import datetime
import sys
import time
import xml.etree.ElementTree as ET
from enum import Enum
import xml.etree.ElementTree as ET
import os

# 10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
# ANSI escape sequences for text colors
RED = "\033[31m"      # Red text
GREEN = "\033[32m"    # Green text
YELLOW = "\033[33m"   # Yellow text
BLUE = "\033[34m"     # Blue text
MAGENTA = "\033[35m"  # Magenta text
CYAN = "\033[36m"     # Cyan text
LIGHT_RED = "\033[91m"       # Light red text
LIGHT_GREEN = "\033[92m"     # Light green text
LIGHT_YELLOW = "\033[93m"    # Light yellow text
LIGHT_BLUE = "\033[94m"      # Light blue text
LIGHT_MAGENTA = "\033[95m"   # Light magenta text
LIGHT_CYAN = "\033[96m"      # Light cyan text
WHITE = "\033[97m"           # White text
DARK_RED = "\033[31;2m"            # Dark red text
DARK_GREEN = "\033[32;2m"          # Dark green text
DARK_YELLOW = "\033[33;2m"         # Dark yellow text
DARK_BLUE = "\033[34;2m"           # Dark blue text
DARK_MAGENTA = "\033[35;2m"        # Dark magenta text
DARK_CYAN = "\033[36;2m"           # Dark cyan text
DARK_GRAY = "\033[90m"             # Dark gray text
# Reset text color escape sequence
RESET = "\033[0m"
color_codes = [RED ,GREEN ,YELLOW ,BLUE ,MAGENTA ,CYAN ,LIGHT_RED ,LIGHT_GREEN ,LIGHT_YELLOW ,LIGHT_BLUE ,LIGHT_MAGENTA ,LIGHT_CYAN ,WHITE,DARK_RED,DARK_GREEN,DARK_YELLOW,DARK_BLUE,DARK_MAGENTA,DARK_CYAN,DARK_GRAY ]
ip = ''
port = 0  

global host 
global authtok
global coreprefix

listofapifunctions ={'updatemanyrecordsbyfield:   ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} updatemanyrecordsbyfield{WHITE}(_field, _value):',
    'updatesinglerecordbyid:     ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} updatesinglerecordbyid{WHITE}(_id,_field,_in):',
    'insertrecord:               ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} insertrecord{WHITE}(_st,_dmp,_ip, _in, _out, _lp,_isid):',
    'getrecordsbyfield:          ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} getrecordsbyfield{WHITE}(_field, _value):',
    'getrecordbyid:              ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} getrecordbyid{WHITE}(_id):',
    'getallrecords:              ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} getallrecords{WHITE}():',
    'deleterecordbyid:           ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} deleterecordbyid{WHITE}(_id):', 
    'pretty:                     ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} pretty{WHITE}(_list):',
    'authenticate:               ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} authenticate{WHITE}(_value):',
    'getinstancebyid:            ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} getinstancebyid{WHITE}(_id):',
    'getinstancebyfield:         ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} getinstancebyfield{WHITE}(_field, value):',
    'insertinstance:             ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} insert_record{WHITE}(_instance_name, _instance_ip, _instance_url, _Instance_count): ',
    'getallinstance:             ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} getallinstance{WHITE}():',
    'deleteinstancebyid:         ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} deleterecordbyid{WHITE}(_id):',
    'updatemanyinstancebyfield:  ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} updatemanyinstancebyfield{WHITE}(_field, _value):',
    'updatemanyrecordsbyfield:   ':f'{LIGHT_BLUE}def{LIGHT_YELLOW} updatemanyrecordsbyfield{WHITE}(_field,_input):'}

listofparameters = ['_instance_id','_instance_name','_instance_ip','_instance_url','_Instance_count','_id','_isid','_field','_value','_st', '_in', '_input', '_new_value', '_dmp', '_ip', '_out', '_lp', '_value', '_list']


""" 
ATTRIBUTE CLASS.
"""
class property(Enum):
    STATE = "_st" 
    IN = "_in"
    OUT = "_out"
    LASTPING = "_lp"
    DUMP = "_dump"
    IPADDRESS = "_ip"
    INSTANCEID = "_isid"
    TARGETID = "_id"
    NAME = "_n"
    INTERVAL = "_zzz"

""" 
INPUT CLASS.
"""
class state(Enum):
    COMMAND = 0 
    SLEEP = 1
    KILL = 2
    LISTEN = 3
    ERROR = -1



def help():
    help_text = '''
  __ _   _ ___ _  _ ___ 
 / _| | | | __| \| |_ _|
( (_| |_| | _|| \\  || | 
 \__|___|_|___|_|\_||_| 

                          _    ___   _ 
                         / \  | o \ | |
                        | o | |  _/ | |
                        |_n_| |_|   |_|                         
 
    '''
    #+  f'\n---------{LIGHT_YELLOW}API{RESET}--------------\n\n'
    help_text = f'{YELLOW}{help_text}{RESET}' 
    for key, value in listofapifunctions.items():
        for val in listofparameters:
            value = value.replace(val, RED+val+WHITE)
        help_text = help_text + (f"{WHITE}{key}{RESET}\n  {LIGHT_BLUE}{value}{RESET}\n\n")
    print(help_text)

def color(text,color):
    return f"{color}{text}{RESET}"


def get_random_color():
    return random.choice(color_codes)



def colorize(input_dict,col1,col2):
    if col1 is not None and col2 is not None :
        for key, value in input_dict.items():
            print(f"{col1}{key}{RESET}{col2}{value}{RESET}")
    else :
        for key, value in input_dict.items():
                print(f"{RED}{key}{RESET}{BLUE}{value}{RESET}")

def is_valid_json(json_string):
    try:
        json_object = json.loads(json_string)
        if isinstance(json_object, dict) or isinstance(json_object, list):
            return True
        else:
            return False
    except ValueError:
        return False

def timestamp():
    now = datetime.datetime.now()
    formatted_time = now.strftime("%Y/%m/%d %H:%M:%S")
    return formatted_time

def logintest():
    return authenticate("super&user")

def login():
    username = input(f"{YELLOW}Enter your username:{RESET}")
    password = input(f"{YELLOW}Enter your password:{RESET}")
    return authenticate(username+'&'+password)

def authenticate(_value):
    # URL of the authentication endpoint
   
    # Data to be sent in the POST request (in this case, a dictionary with a 'value' key)
    data = {
        "value": _value
    }
    # Convert the data dictionary to JSON format
    json_data = json.dumps(data)

    # Set the headers to indicate that the data being sent is in JSON format
    headers = {
        "Content-Type": "application/json",
    }
    try:
        # Send a POST request to the endpoint
        response = requests.post(host+'/auth', data=json_data, headers=headers)
        # Check the response status code and return True if authentication is successful
        if response.status_code == 200:
            core = json.loads(response.text)
            global authtok
            global coreprefix
            coreprefix  = core["_core_id"]
            authtok = core["_sessiontoken"]
            #print(authtok+"  "+coreprefix)
            return core
        else:
            print("Authentication failed. Status code:", response.status_code)
            return False
    except requests.exceptions.RequestException as e:
        print("Error:", e)
        return False

def compare_tokens(session_token):
    url = f'{host}/s/{session_token}'
    url2 = f'{host}/s/v/{session_token}'
    response = requests.get(url)
    if response.status_code == 200:
        print("Session exists!")
        response = requests.get(url2)
        if response.status_code == 200:
            print('Session valid!')
        else:
            print('not valid :(')
    elif response.status_code == 400:
        print("Session does not exist!")
    else:
        print(f"Unexpected status code: {response.status_code}")


def colorize_pprint(records):
    # Define a list of color codes
    # Iterate through records and print each record with a different color
    for idx, record in enumerate(records):
        # Use modulo operator to cycle through color codes if there are more records than colors
        color_code = random.choice(color_codes)

        # Convert record to a JSON string
        json_string = json.dumps(record, indent=2)

        # Combine the color code with the JSON string
        colored_json_string = f'{color_code}{json_string}{RESET}'  # '\033[0m' resets text color
        
        # Print the colored JSON string
        print(colored_json_string)

def pretty(arg):
        # Check if the object is a dictionary
    # if isinstance(arg, dict):
    #     colorize(arg)
    if isinstance(arg, list):
        colorize_pprint(arg)
    else:
        print("It's neither a dictionary nor a list.")
    #colorize_pprint(arg)

def getsinglecharinput(prompt):
    while True:
        user_input = input(prompt)
        if len(user_input) == 1:
            return user_input
        else:
            print("Invalid input. Please enter a single character.")

def format_string_values(obj):
    x = f'{RED}{obj}{RESET}'
    if isinstance(obj, str):
        # Apply your formatting logic here
        # For example, add color codes to string values
        return x  # '\033[91m' sets text color to red
    elif isinstance(obj, dict):
        # Recursively format stri
        # ng values in nested dictionaries
        return {key: format_string_values(value) for key, value in obj.items()}
    else:
        return obj

def getnumberbetween(lower, upper):
    while True:
        try:
            user_input = get_integer_input("enter between " + str(lower) + ' & ' + str(upper) + ' > ')
            if lower <= user_input <= upper:
                return user_input
            else:
                print("Please enter an integer between 0 and 4.")
        except ValueError:
            print("Invalid input. Please enter an integer.")
            
def getinput(prompt):
    while True:
        user_input = input(prompt)
        if user_input.strip():  # Check if the input is non-empty after removing leading/trailing whitespace
            return user_input
        else:
            print("Input cannot be empty. Please enter a non-empty string.")

def get_integer_input(prompt):
    while True:
        user_input = input(prompt)
        try:
            integer_value = int(user_input)
            return integer_value
        except ValueError:
            print("Invalid input. Please enter a valid integer.")

def isNullOrWhiteSpace(input_string):
    # Check if the input is None or empty
    if input_string is None or len(input_string) == 0:
        return True
    
    # Check if the input contains only whitespace characters
    if input_string.isspace():
        return True
    
    return False

def syncCore(core):
    try:
        # Make a POST request to the API endpoint
        response = requests.post(host+'/{}/s', json=json.loads(core))
        # Check the status code of the response
        if response.status_code == 200:
            return response.text
        elif response.status_code == 400:
            print("Missing required fields")
        elif response.status_code == 401:
            print("User already exists")
        else:
            print(f"Error: {response.status_code}, {response.json()}")
    except Exception as e:
        print(f"An error occurred: {e}")


def create_user_core(password, username, core_id):
    url = host  # Replace with your actual API host

    # Prepare the JSON payload
    payload = {
        "password": password,
        "username": username,
        "core_id": core_id
    }

    try:
        # Make a POST request to the API endpoint
        response = requests.post(url, json=payload)

        # Check the status code of the response
        if response.status_code == 201:
            print("User created successfully")
        elif response.status_code == 400:
            print("Missing required fields")
        elif response.status_code == 401:
            print("User already exists")
        else:
            print(f"Error: {response.status_code}, {response.json()}")
    except Exception as e:
        print(f"An error occurred: {e}")



def readconfig():
    xml_data = ''

    with open(os.path.dirname(__file__)+'/config.xml','r') as f:
        xml_data = f.read()
        #print(xml_data)
    # Parse XML
    root = ET.fromstring(xml_data)
    
    host_element = root.find('host')
    if host_element is None:
        return 
    ip = host_element.text
    # Function to get port from XML

    port_element = root.find('port')
    if port_element is None:
        return 
    port = port_element.text

    global host 
    host =  f'http://{ip}:{port}'


# import time 
# import subprocess
# def ping_host(hostname):
#     for i in range(100):
#         try:
#             # Run the ping command and capture the output
#             result = subprocess.run(["ping", "-c", "1", "-W", "1", hostname], capture_output=True, text=True, check=True)
#             response_data = result.stdout.strip()
#             print("Response data:", response_data)
#         except subprocess.CalledProcessError:
#             print("Ping failed: Host unreachable or timeout.")
#         time.sleep(1)

# # Usage example
# ping_host("192.168.2.245")
