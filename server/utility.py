from enum import Enum
import pdb
from pony.orm import Database, Required, Optional, PrimaryKey, select, delete
from pony import orm
import xml.etree.ElementTree as ET
import os
import bcrypt
import uuid
import datetime
import random
import string
import json
import pprint

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

db = orm.Database("sqlite", "server.db")
# Define the Targ entity using Pony ORM

""" 
ATTRIBUTE CLASS.
"""
class Attribute(Enum):
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
class _state(Enum):
    COMMAND = 0 
    SLEEP = 1
    KILL = 2
    LISTEN = 3
    INTERVAL = 4
    ERROR = -1


""" 
ACTION CLASS.
"""
class ActionType(Enum):
    GET = 0 
    INSERT = 1
    UPDATE = 2
    DELETE = 3
    PING = 4
    EXEC = 5
    DOWNLOAD = 6
    SUCCESS = 7
    FAILED = 8
    ERROR = 9
    AUTHENTICATED = 10


class Core:
    instance_id = orm.Required(str)
    _id = orm.PrimaryKey(int,auto=True)


# Define the Targ entity using Pony ORM
class Target(db.Entity):
    _id = orm.PrimaryKey(int, auto=True)
    _st = orm.Required(int, auto=True)
    _dmp = orm.Optional(str)
    _ip = orm.Optional(str)
    _in = orm.Optional(str)
    _out = orm.Optional(str)
    _lp = orm.Optional(str)
    _isid = orm.Required(str)
    _zzz = orm.Required(int)
    _n = orm.Optional(str)

    def assign_value(self, field, value):
        if field == '_id':
                self._id = value  
        elif field == '_st':
                    self._st = value  
        elif field == '_dmp':
                    self._dmp = value  
        elif field == '_ip':
                    self._ip = value  
        elif field == '_in':
                    self._in = value  
        elif field == '_out':
                    self._out = value  
        elif field == '_lp':
                    self._lp = value  
        elif field == '_isid':
                    self._isid = value  
        elif field == '_zzz':
                    self._zzz = value  
        elif field == '_n':
                    self._n = value  
        else:
            return(f"Invalid field: {field}")

class Instance(db.Entity):
    _id = orm.PrimaryKey(int, auto=True)
    _instance_id = orm.Optional(str,unique=True)
    _instance_name = orm.Optional(str)
    _instance_ip = orm.Optional(str)
    _instance_url = orm.Optional(str)
    _Instance_count = orm.Optional(int)
    _core_id = orm.Optional(str)

    @orm.db_session
    def insert_instance(_id,
                                _instance_id,
                                _instance_name ,
                                _instance_ip ,
                                _instance_url ,
                                _Instance_count, 
                                _core_id ):
        Instance(
        _id  =  _id ,
        _instance_id  =     _instance_id ,
        _instance_name  =     _instance_name ,
        _instance_ip  =     _instance_ip ,
        _instance_url  =     _instance_url ,
        _Instance_count  =     _Instance_count ,
        _core_id  =     _core_id )
        orm.commit()


#dummy inserts below
class Configuration(db.Entity):
    _id = orm.PrimaryKey(int, auto=True)
    _session_len = orm.Required(int)
    _theme = orm.Required(int)
    _title = orm.Required(str)
    _host_name = orm.Required(str)
    _ip_address = orm.Required(str)
    _port = orm.Required(int)
    _hash_id = orm.Required(str)
    _core_id = orm.Required(str)
    
    _log_ret_days = orm.Optional(int)
    _inactivitytimeout  = orm.Optional(int)
    _redirect_to_dump  = orm.Optional(int)
    _create_on_ping  = orm.Optional(int)
    _use_http  = orm.Optional(int)
    _log_create  = orm.Optional(int)
    _log_delete  = orm.Optional(int)
    _log_commands  = orm.Optional(int)
    _log_pings  = orm.Optional(int)



    @orm.db_session
    def insert_Configuration(
                            session_len,
                            theme,
                            title,
                            host_name,
                            ip_address,
                            port,
                            hash_id,
                            core_id,
                            _log_ret_days,
                            _redirect_to_dump,
                            _create_on_ping,
                            _use_http,
                            _log_create,
                            _log_delete,
                            _log_commands,
                            _log_pings,
                            _inactivitytimeout,):
        Configuration( 
                        _session_len  = session_len,
                        _theme  = theme,
                        _title  = title,
                        _host_name  = host_name,
                        _ip_address  = ip_address,
                        _port  = port,
                        _hash_id  = hash_id,
                        _core_id  = core_id,
                        _log_ret_days =_log_ret_days,
                        _redirect_to_dump = _redirect_to_dump ,
                        _create_on_ping = _create_on_ping ,
                        _use_http = _use_http ,
                        _log_create = _log_create ,
                        _log_delete = _log_delete ,
                        _log_commands = _log_commands ,
                        _log_pings = _log_pings ,
                        _inactivitytimeout = _inactivitytimeout)
        orm.commit()

class User(db.Entity):
    _hash_id = orm.Required(str)
    _username = orm.Required(str)
    _AuthToken = orm.Optional(str)
    _core_id = orm.Required(str)
    _id = orm.PrimaryKey(int,auto=True)
    
    @orm.db_session
    def insert_user(hashid,user,core):
        User(_hash_id=hashid,_core_id=core,_username=user,_AuthToken="")

class Files(db.Entity):
    _filename = Required(str,unique=True)
    _filesize = Required(int)
    _extension = Required(str)
    _core_id = Required(str)
    _id = PrimaryKey(int, auto=True)


class Listeners(db.Entity):
    _core_id = orm.Required(str)
    _listener_name = orm.Optional(str)
    _ipaddress = orm.Optional(str)
    _last_ping  = orm.Optional(str)
    _id = orm.PrimaryKey(int,auto=True)
    
    @orm.db_session
    def insert_Listener(_core_id,_listener_name,_listener_IpAddress,_last_ping):
        Listeners(_core_id=_core_id,
                  _listener_name=_listener_name,
                  _ipaddress=_listener_IpAddress,
                  _last_ping=_last_ping)


""" 
LOGGING CLASS.
"""
class Log(db.Entity):
    _id = orm.PrimaryKey(str,auto=True)
    _instance_id = orm.Optional(str)
    _target_name = orm.Optional(str)
    _action = orm.Optional(int)
    _time = orm.Optional(str)
    _result = orm.Optional(int)
    _core_id = orm.Optional(str)
    _target_id = orm.Optional(int)
    _msg = orm.Optional(str)
    # Insert operation
    @orm.db_session
    def insert_log(instance_id, target_name, action, log_time,result,_msg,_core_id):
        try:
            #print()
            #print(f'{instance_id, target_name, action, log_time,result,_msg}******************************DEBUG ')
            serverPrinter(instance_id, target_name, action, log_time,result,_msg)
            Log(_instance_id=instance_id, _target_name=target_name, _action=action, _time=log_time,_result=result,_msg=_msg,_core_id=_core_id)
        except Exception as e:
            print(f'Exception: {e}')
                    

    # Delete all logs
    @orm.db_session
    def delete_all_logs():
        delete(l for l in Log)



class Core(db.Entity):
    _core_id = orm.PrimaryKey(str )
    _id = orm.Required(int, auto=True)
    
    @orm.db_session
    def insert_core(core_id):
        Core(_core_id=core_id)
        return core_id
    
    @orm.db_session
    def delete_core(core_id):
        core = Core.get(_core_id=core_id)
        if core:
            core.delete()
            orm.commit()

class Hashtable(db.Entity):
    _password = orm.Required(str, unique=True)
    _username = orm.Required(str, unique=True)
    _core_id = orm.Required(str)
    _id = orm.PrimaryKey(int, auto=True)

    @classmethod
    @orm.db_session
    def generate_hash(cls,username, password):
        # example password 
        passwordToHash = f'{username,password}'
        # converting password to array of bytes 
        bytes = passwordToHash.encode('utf-8') 
        # generating the salt 
        salt = bcrypt.gensalt() 
        # Hashing the password 
        hashed_str = bcrypt.hashpw(bytes, salt) 
        return str(hashed_str)
    
    @classmethod
    @orm.db_session
    def compare_hash(cls,username,password,hashvalue):
        #Taking user entered password  
        passwordToHash = f'{username,password}'
        #print(f'{username} : {password} : {hashvalue}')
        # encoding user password 
        userBytes = passwordToHash.encode('utf-8') 
        # checking password
        # Remove the "b'" and "'"
        salt_bytes = hashvalue[2:-1].encode('utf-8')
        return bcrypt.checkpw(userBytes, salt_bytes)

    @classmethod
    @orm.db_session
    def exists(cls,username,password,hash):
        return cls.compare_hash(username,password,hash)
       
    @classmethod
    @orm.db_session
    def insert(cls,username,password,_core_id):
        hpassword = cls.generate_hash(username,password)
        with orm.db_session:
            uid =  Guid()
            Hashtable(_hash_id =uid,_password=hpassword, _username=username)
            User.insert_user(hashid= uid,user=username,core=_core_id)
            orm.commit()
            return True

    @classmethod
    @orm.db_session
    def insert_core_user(cls,username,password,coreid):
        hpassword = cls.generate_hash(username,password)
        with orm.db_session:
            Hashtable(_password=hpassword, _username=username,_core_id=coreid)
            orm.commit()
            return True

    @classmethod
    @orm.db_session
    def Authenticate(cls, password, username):
        try:
            # Query the database for the user
            htpwd = orm.select(ht for ht in Hashtable if ht._username == username).first()
            # Check if the user exists and the password is correct
            if htpwd and cls.exists(username, password, htpwd._password):
                c = htpwd._core_id
                b = True  #successful authentication
                return c, b
            else:
                return None, False
        except Exception as e:
            print(f"Authentication error: {e}")
            return None, False

class Sessions(db.Entity):
    _session_token = orm.Required(str, unique=True)
    _session_expiry_time = orm.Required(str)
    _id = orm.PrimaryKey(int, auto=True)
    
    @classmethod
    @orm.db_session
    def create_session(cls,session_token, session_expiry_time):
        Sessions(_session_token=session_token, _session_expiry_time=session_expiry_time)
        db.commit()
    
    @classmethod
    @orm.db_session
    def delete_session_by_token(cls,session_token):
        session = Sessions.get(_session_token=session_token)
        if session:
            session.delete()
        
    @classmethod
    @orm.db_session
    def GenerateSession(cls):
        token = generate_random_string(25)
        thirty_minutes_from_now = datetime.datetime.now() + datetime.timedelta(minutes=30)
        cls.create_session(token,  str(thirty_minutes_from_now))
        return token

    @classmethod
    @orm.db_session
    def session_exists(cls,session_token):
        # Use the Pony ORM query to find a session by the provided session_token
        session = Sessions.get(_session_token=session_token)
        if session is not None:
            thirty_minutes_from_now = datetime.datetime.now() + datetime.timedelta(minutes=30)
            session._session_expiry_time = str(thirty_minutes_from_now)
            # Commit the changes to the database
            db.commit()
            return True
        else:
            return False
    
    @classmethod
    @orm.db_session
    def session_valid(cls, session_token):
        s = select(i for i in Sessions if i._session_token == session_token).first()
        #if we don't get anything back return false
        #print(f's is {s} token is {session_token}')
        if s is None:
            print('s is none')
            return False 
        # Convert the string to a datetime object
        session_expiry_time = datetime.datetime.strptime(s._session_expiry_time, '%Y-%m-%d %H:%M:%S.%f')
        # Compare with the current datetime
        #   ex: '2023-11-11 18:08:16.549004'
        if session_expiry_time > datetime.datetime.now():
            return True
        else:
            s.delete()
            print('expired')
            return False
        return False
        


db.generate_mapping(create_tables=True)

def Guid():
    """
    Generate a random GUID (Globally Unique Identifier).
    """
    random_guid = uuid.uuid4()
    return str(random_guid)

def generate_random_string(length=25):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string

def create_core():
    Core(Guid())
    orm.commit()


def insert_into_log(request):
    #print('logger.')
    #print(request)
    pass
    

def log_manager(typeofaction):
    #print('\n')
    pass


def getlabel(value):
## PRINTING OUT THE INTEGER NOT THE LABEL
    if not isinstance(value, int):
        return f"{RED}FAILED{RESET}"  # or any other default value you prefer
    action_text = [
        "GET",
        "INSERT",
        "UPDATE",
        "DELETE",
        "PING",
        "EXEC",
        "DOWNLOAD",
        "SUCCESS",
        "FAILED",
        "ERROR",
        "AUTHENTICATED"
    ]

    label = action_text[value]
    act =  f"{RED}{label}{RESET}" if value == 8 or value  == 9 or value == 4 else f"{GREEN}{label}{RESET}"
    return act
    #print(label)

''' CONFIGURATION '''
def gethostname(name):
    with open('config.xml', 'r') as f:
        xml_data = f.read()
        root = ET.fromstring(xml_data)
        for host_element in root.findall('host'):
            if host_element.attrib.get('name') == name:
                ip = host_element.attrib.get('ip')
                port = host_element.attrib.get('port')
                return ip, int(port)
    return None

def read_xml():
    with open('config.xml', 'r') as f:
        xml_data = f.read()
        return ET.fromstring(xml_data)

def write_xml(tree):
    tree.write('config.xml', encoding='utf-8', xml_declaration=True)

def find_host_by_name(name, root):
    for host_element in root.findall('host'):
        if host_element.attrib.get('name') == name:
            return host_element
    return None

def add_host(name, ip, port):
    root = read_xml()

    # Check if host with the same name already exists
    if find_host_by_name(name, root):
        print(f'Host with name "{name}" already exists.')
        return

    # Create a new host element
    new_host = ET.SubElement(root, 'host', {'name': name, 'ip': ip, 'port': str(port)})

    write_xml(ET.ElementTree(root))

    print(f'Host "{name}" added successfully.')

def delete_host(name):
    root = read_xml()
    host_element = find_host_by_name(name, root)

    if host_element:
        root.remove(host_element)
        write_xml(ET.ElementTree(root))
        print(f'Host "{name}" deleted successfully.')
    else:
        print(f'Host with name "{name}" not found.')



#serverPrinter({instance_id, target_name, action, log_time,result,_msg})
# def serverPrinter(instance_id, target_name, action, log_time, result, _msg):
#     print(f'{DARK_RED}>>>{RESET} instance id: [ {YELLOW}{instance_id}{RESET} ] \ntarget?: [ {WHITE}{target_name}{RESET} ] \naction: [ {getlabel(action)} ] \ntime: [ {LIGHT_CYAN}{log_time}{RESET} ] \nresult: [ {YELLOW}{getlabel(result)}{RESET} ] \nmsg: [ {GREEN}{_msg}{RESET} ]')
def serverPrinter(instance_id, target_name, action, log_time, result, _msg):
    print(f'''{DARK_RED}>>> {RESET}instance id:   [{YELLOW}{instance_id}{RESET}]
target?:        [{WHITE}{target_name}{RESET}]
action:         [{getlabel(action)}]
time:           [{LIGHT_CYAN}{log_time}{RESET}]
result:         [{YELLOW}{getlabel(result)}{RESET}]
msg:            [{GREEN}{_msg}{RESET}]''')

@orm.db_session
def validateAuthToken(auth_token):
    # Retrieve the session with the given auth_token
    session = select(s for s in Sessions if s._session_token == auth_token).first()

    if session:
        # Check if the session has not expired
        session_expiry_time = datetime.strptime(session._session_expiry_time, '%Y-%m-%d %H:%M:%S')
        current_time = datetime.datetime.now()

        if current_time < session_expiry_time:
            return True  # Auth token is valid
        else:
            return False  # Auth token has expired
    else:
        return False  # Auth token not found in the Sessions table

@orm.db_session
def sync_core(corestr):
    try:
        core = json.loads(corestr)
        if isinstance(core, dict):
            # Access the "_core_id" key if it exists
            core_id = core.get("_core_id", None)
            session_id  =core.get("_sessiontoken",None)
            
            #......UPDATE.THE.CONFIGURATION......
            #core_id
            configuration = select(c for c in Configuration if c._core_id == core_id).first()
            # Check if the configuration with the specified core_id exists
            if configuration:
                # Update the attributes of the configuration entity with new_data
                for key, value in core.get('_config').items():
                    setattr(configuration, key, value)
                # Commit the changes to the database
            
            #......UPDATE.THE.INSTANCE......
            #core_id
            instances = select(c for c in Instance if c._core_id == core_id)
            for i in instances:
                if i:
                    for j in core.get("_instances") :
                        print(str(j["_id"]) + "----"  + str(i._id))
                        if j["_id"] == i._id:
                            for key, value  in j.items() :
                                setattr(i,key,value)
            #......UPDATE.THE.TARGETS......

                    # Commit the changes to the database
         
            orm.commit()
            #......GET.THE.CORE......
            #core_id
            configuration = select(c for c in Configuration if c._core_id == core_id).first()
            # Convert the list of dictionaries to a JSON string
            configuration_json  = json.dumps(configuration.to_dict(), default=str)

              #Instances
            instances = select(c for c in Instance if c._core_id == core_id)[:]
            # Convert instances to a list of dictionaries
            instances_dict_list = [instance.to_dict() for instance in instances]
           
            #target
            for i in instances_dict_list:
                id = i["_instance_id"]
                #core_id
                targets = select(c for c in Target if c._isid == id)
                target_dicts = [target.to_dict() for target in targets]
                i['_targets'] = target_dicts

            # Convert the list of dictionaries to a JSON string
            instances_json = json.dumps(instances_dict_list, default=str)
            #targets_json = json.dumps(li_targets)
            #instances_json = json.dumps(instances_dict_list, default=str)
            #configuration_json  = json.dumps(configuration.to_dict(), default=str)
            coreJson = {"_core_id" :core_id,"_sessiontoken":session_id ,"_config" :configuration_json,"_instances":instances_json }
            return json.dumps(coreJson)
        
        else:
            print("Error: The loaded JSON is not a dictionary.")
            return 'None'
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return 'None'
    return 'None'

@orm.db_session
def BuildStorageObjects(corestr):
    userfiles = Files.select(lambda i :  i._core_id == corestr)
    payload = []
    for f in userfiles:
        payload.append(
            {
                "_name":f"{f._filename}",
                "_size": f"{f._filesize}",
                "_extension":f"{f._extension}",
            }
        )
    payload_Header = { "_core_id":f"{corestr}","_files":payload  }
    return json.dumps(payload_Header)


@orm.db_session
def create_user(username,password,_core_id):
    if Hashtable.Authenticate(password,username)[1]:
        return  False
    try:
        Hashtable.insert_core_user(username,password,_core_id)
        Log.insert_log(f"{_core_id}",
                'create_user():',
                ActionType.GET.value,
                datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                ActionType.SUCCESS.value,
                "{\"msg\":\"create_user(): 201 {'message': 'user created successfully'}"+"\"}")
        return  True
    except Exception as e:
        print(e)
        Log.insert_log(f"{_core_id}",
                'create_user():',
                ActionType.GET.value,
                datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                ActionType.ERROR.value,
                "{\"msg\":\"def create_user(): 201\"}")
    return False

"""
BUILD THE PAYLOAD
"""
def build_payload(core,isid,id):
    print(f"{CYAN}*SETTING TARGET POINTERS{RESET}")
    print(f"TARGET ID :{id}, HANDLED BY INSTANCE, ID:{isid}")
    print(f"{CYAN}*COMPILING TARGET BINARY{RESET}")
    print(f"{GREEN}*COMPILATION SUCCESSFUL{RESET}")
    print(f"{RED}*COMPILATION FAILED{RESET}")
    print(f"{GREEN}*TARGET BINARY CREATED{RESET}")

#RETURN THE CORE DATA STRUCTURE
"""
THE GOD GUID 26f713dd-4ab9-4b65-88c4-ac2792240afe
"""
def return_core(core_id,sessiontoken):
    try:
        with orm.db_session:
            # Retrieve the record by ID
            core = Core.get(_core_id=core_id)
            # Check if the record exists
            if core:
                #core
                configJson = {}
                InstanceJson = []
                usersJson = []
                listen = []
                config_object = orm.select(c for c in Configuration if c._core_id == core_id).first()
                users = orm.select(c for c in User if c._core_id == core_id)
                if users : 
                    for i in users :
                        usersJson.append({
                                "_hash_id" : i._hash_id,
                                "_username" :  i._username,
                                "_AuthToken" :  i._AuthToken,
                                "_core_id" :  i._core_id
                        })
                if config_object:
                    config_dict = {
                        "_id": config_object._id,
                        "_session_len": config_object._session_len,
                        "_theme": config_object._theme,
                        "_title": config_object._title,
                        "_host_name": config_object._host_name,
                        "_ip_address": config_object._ip_address,
                        "_port": config_object._port,
                        "_hash_id": config_object._hash_id,
                        "_core_id": config_object._core_id,
                        "_log_ret_days": config_object._log_ret_days,
                        "_redirect_to_dump" : config_object._redirect_to_dump,
                        "_create_on_ping" : config_object._create_on_ping,
                        "_use_http" : config_object._use_http,
                        "_log_create" : config_object._log_create,
                        "_log_delete" : config_object._log_delete,
                        "_log_commands" : config_object._log_commands,
                        "_log_pings" : config_object._log_pings,
                        "_inactivitytimeout" : config_object._inactivitytimeout
                    }
                    configJson = config_dict

                    listeners = orm.select(l for l in Listeners if l._core_id == core_id)
                    if len(listeners) > 0 :
                        for i in listeners:
                            listen.append({
                            "_core_id" : i._core_id,
                            "_listener_name" : i._listener_name,
                            "_ipaddress" : i._ipaddress,
                            "_last_ping" : i._last_ping,
                            "_id" : i._id,
                            })

                    InstanceObjects = orm.select(c for c in Instance if c._core_id == core_id)
                    if len(InstanceObjects) > 0 :
                        for i in InstanceObjects :
                            targetlist = []
                            targs = orm.select(c for c in Target if c._isid == i._instance_id)
                            for g in targs :
                                targetlist.append({
                                    "_ip": g._ip,
                                    "_st": g._st,
                                    "_dmp": g._dmp,
                                    "_in": g._in,
                                    "_out": g._out,
                                    "_lp": g._lp,
                                    "_id": g._id,
                                    "_isid": g._isid,
                                    "_zzz": g._zzz,
                                    "_n": g._n,
                                })
                            InstanceJson.append(
                                {"_id":i._id,
                                "_instance_id":i._instance_id,
                                "_instance_name":i._instance_name,
                                "_instance_ip":i._instance_ip,
                                "_instance_url":i._instance_url,
                                "_Instance_count":i._Instance_count,
                                "_core_id":i._core_id,
                                "_targets": targetlist           
                                }
                                )
                print(listeners)
                coreJson = {"_core_id" :core._core_id,"_sessiontoken":sessiontoken ,"_config" :configJson, "_users":usersJson, "_listeners":listen, "_instances":InstanceJson}
                return json.dumps(coreJson) , core._core_id
    except Exception as e:
        print(f"Error: {e}")
        return None 
    return None


