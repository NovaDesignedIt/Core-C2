import sys
from flask import Flask,request,abort, send_file, send_from_directory,session,jsonify,redirect,render_template,url_for
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
from zipfile import ZipFile

host=''
port=0
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173") 
app.secret_key = 'your_secret_key'
secrets = 'ziggy'
IMAGE_FOLDER = './upl/ph/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif','txt','js','sh','bat','php'}
app.config['IMAGE_FOLDER'] = IMAGE_FOLDER

""" INSTANCE MANAGER OPERATIONS """ 
#Instance Manager
@app.route('/<_core_id>/i/<field>/<value>', methods=['GET'])
@orm.db_session
def getinstancebyfield(_core_id,field, value):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"getinstancebyfield(_core_id,field, value):: 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve records based on the specified field and its value from the Target entity
            records = Utility.Instance.select(lambda t: getattr(t, field) == value)[:]
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

                
                Utility.Log.insert_log(f"{request}",
                               f'fetching {len(records)} records field: {field} value: {value}',
                               action.GET.value,
                               str(datetime.now()),
                               action.SUCCESS.value,
                               "{\"msg\":\"getinstancebyfield(_core_id,field, value):"+"\"}",_core_id) #LOGGER
                return jsonify(records_data)  # Return the records as JSON response
            else:

                
                Utility.Log.insert_log(f"{request}",
                               'None',
                               action.GET.value,
                               str(datetime.now()),
                               action.FAILED.value,
                               "{\"msg\":\"getinstancebyfield(_core_id,field, value):"+"\"}",_core_id) #LOGGER
                return '404', 404  # Return '404' if no records match the criteria
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                               f'None  {field} value: {value}',
                               action.GET.value,
                               str(datetime.now()),
                               action.ERROR.value,
                               "{\"msg\":\"getinstancebyfield(_core_id,field, value): "+f"Error: {e}"+"\"}",_core_id) #LOGGER
        return '500', 500  # Return '500' in case of any error during retrieval
        
@app.route('/<_core_id>/i', methods=['POST'])
@orm.db_session  # Use db_session decorator to manage database sessions
def insertinstance(_core_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def insertinstance(_core_id): 401"+"\"}",_core_id) #LOGGER
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
        instance = Utility.Instance(_instance_id=instance_id,
                                _instance_name=instance_name,
                                _instance_ip=instance_ip,
                                _instance_url=instance_url,
                                _Instance_count=instance_count,
                                _core_id=core_id)
        orm.commit()  # Commit the transactionType to save the record in the database
        
        Utility.Log.insert_log(f"{request}",
                               instance_name,
                               action.INSERT.value,
                               str(datetime.now()),
                               action.SUCCESS.value,
                               "{\"msg\":\"insertinstance(_core_id): 201"+"\"}",_core_id) #LOGGER
        

        instances = orm.select(i for i in Utility.Instance if i._core_id == _core_id )  
        records_data = [record.to_dict() for record in instances]
        t = jsonify(records_data)
        Utility.Log.insert_log(f"{request}",
                                'getallisteners',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.SUCCESS.value,
                                "{\"msg\":\"def getListeners(_core_id): 200"+"\"}",_core_id) #LOGGER
        return t , 200  # Return success message and status code 201 (Created)
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                               'None',
                               action.INSERT.value,
                               str(datetime.now()),
                               action.FAILED.value,
                               "{\"msg\":\"def insertinstance(_core_id): 400"+"\"}",_core_id) #LOGGER
        return str(e), 400  # Return error message and status code 400 (Bad Request) in case of errors

@app.route('/<_core_id>/i/<int:record_id>', methods=['GET'])
@orm.db_session
def getinstancebyid(_core_id,record_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"getinstancebyid(_core_id,record_id): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    try:
        with orm.db_session:
            #print(record_id)
            # Retrieve the record by ID from the Target entity
            target_record = Utility.Instance.select(lambda s: s._id == record_id and s._core_id == _core_id).first()
            
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
                               "{\"msg\":\"getinstancebyid(_core_id,record_id): 200\"}",_core_id) #LOGGER
                return retObj # Return the record as JSON response
            else:

                
                Utility.Log.insert_log(f"{request}",
                               'None',
                               action.GET.value,
                               str(datetime.now()),
                               action.FAILED.value,
                               "{\"msg\":\"getinstancebyid(_core_id,record_id): 404"+"\"}",_core_id) #LOGGER
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
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"getallinstance(_core_id): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve all records from the Target entity
            records = Utility.Instance.select(lambda s: s._core_id == _core_id)
            # Convert the records to a list of dictionaries and return it as JSON response
            record_data = [{
            "_id": record._id,
            "_instance_id": record._instance_id,
            "_instance_name": record._instance_name,
            "_instance_ip": record._instance_ip,
            "_instance_url": record._instance_url,
            "_Instance_count": record._Instance_count,
            "_core_id": record._core_id
            } for record in records]
            
            Utility.Log.insert_log(f"{request}",
                               f'fetching {len(records)} records',
                               action.GET.value,
                               str(datetime.now()),
                               action.SUCCESS.value,
                               "{\"msg\":\"getallinstance(_core_id): 200"+"\"}",_core_id) #LOGGER
            return jsonify(record_data)  # Return the records as JSON response
    
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                               'None',
                               action.GET.value,
                               str(datetime.now()),
                               action.ERROR.value,
                               "{\"msg\":\"getallinstance(_core_id): 500 "+f"Error: {e}"+"\"}",_core_id) #LOGGER
        return 500  # Return '500' in case of any error during retrieval

@app.route('/<_core_id>/i/<int:record_id>', methods=['DELETE'])
@orm.db_session
def deleteinstancebyid(_core_id,record_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"deleteinstancebyid(_core_id,record_id): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve the record by ID
            instance = Utility.Instance.get(_id=record_id)
            # Check if the record exists

            isid = instance._instance_id

            if instance:
                # Delete the record from the database
                instance.delete()

                Utility.Log.insert_log(f"{request}",
                               f'Deleted {record_id}',
                               action.DELETE.value,
                               str(datetime.now()),
                               action.SUCCESS.value,
                               "{\"msg\":\"deleteinstancebyid(_core_id,record_id): 200"+"\"}",_core_id) #LOGGER
                
                orm.delete(entry for entry in Utility.Target if entry._isid == isid)
                orm.commit()
                
                instances = orm.select(i for i in Utility.Instance if i._core_id == _core_id )  
                records_data = [record.to_dict() for record in instances]
                t = jsonify(records_data)
                return t, '200'  # Return '200' to indicate successful deletion
            else:
                
                Utility.Log.insert_log(f"{request}",
                               'None',
                               action.DELETE.value,
                               str(datetime.now()),
                               action.FAILED.value,
                               "{\"msg\":\"deleteinstancebyid(_core_id,record_id): 404"+"\"}",_core_id) #LOGGER
                return '404'  # Return '404' if the record with the specified ID does not exist
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                               'None',
                               action.DELETE.value,
                               str(datetime.now()),
                               action.ERROR.value,
                               "{\"msg\":\"deleteinstancebyid(_core_id,record_id): 500" + f"Error: {e}"+"\"}",_core_id) #LOGGER
        return '500'  # Return '500' in case of any error during deletion

@app.route('/<_core_id>/i/<id>/<field>/<value>')
@orm.db_session
# Function to update a specific field in a record by ID
def updatesingleInstancebyid(_core_id,id, field, value):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"updatesingleInstancebyid(_core_id,id, field, value): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve the record by ID directly from the Targ entity
            instance = Utility.Instance.get(_id=id)
            print(f"id: {id} field: {field} value:{value}",_core_id) #LOGGER
            # Check if the record exists
            if instance:
                # Update the specified field with the new value
                setattr(instance, field, value)
                orm.commit()
                
                Utility.Log.insert_log(f"{request}",
                                f'updated single field:{field} value:{value}',
                                action.UPDATE.value,
                                str(datetime.now()),
                                action.SUCCESS.value,
                                "{\"msg\":\"updatesingleInstancebyid(_core_id,id, field, value): 200"+"\"}",_core_id) #LOGGER
                return '200'  # Return True to indicate successful update
            else:
                
                Utility.Log.insert_log(f"{request}",
                                'None',
                                action.UPDATE.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"updatesingleInstancebyid(_core_id,id, field, value): 404"+"\"}",_core_id) #LOGGER
                return '404'  # Return False if the record with the specified ID does not exist
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                                'None',
                                action.UPDATE.value,
                                str(datetime.now()),
                                action.ERROR.value,
                                "{\"msg\":\"updatesingleInstancebyid(_core_id,id, field, value): 500 "+f"Error: {e}"+"\"}",_core_id) #LOGGER
        return '500'  # Return '500' in case of any error during deletion

#@Client updatemanyinstancebyfield():
@app.route('/<_core_id>/i/<field>/<value>/<new_value>', methods=['PUT'])
@orm.db_session
def updatemanyinstancebyfield(_core_id,field,value,new_value):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\" updatemanyinstancebyfield(_core_id,field,value,new_value): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve records based on the specified field and its current value
            instances = Utility.Instance.select(lambda t: getattr(t, field) == value)[:]
            # Check if any records match the criteria
            if instances:
                # Update the specified field with the new value for all matching records
                for index, record in enumerate(instances):
                    print("Iteration:", index + 1)  # Add 1 because index is zero-based
                    setattr(record, field, new_value)
                orm.commit()
                
                Utility.Log.insert_log(f"{request}",
                                f' field:{field}, value:{value} ,new value:{new_value}',
                                action.UPDATE.value,
                                str(datetime.now()),
                                action.SUCCESS.value,
                                "{\"msg\":\" updatemanyinstancebyfield(_core_id,field,value,new_value): 200 "+"\"}",_core_id) #LOGGER
                return '200'  # Return '200' to indicate successful update
            
            else:
                
                Utility.Log.insert_log(f"{request}",
                                    None,
                                    action.UPDATE.value,
                                    str(datetime.now()),
                                    action.FAILED.value,
                                    "{\"msg\":\" updatemanyinstancebyfield(_core_id,field,value,new_value): 404 "+"\"}",_core_id) #LOGGER
                return '404'  # Return '404' if no records match the criteria
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                    None,
                    action.UPDATE.value,
                    str(datetime.now()),
                    action.ERROR.value,
                    "{\"msg\":\" updatemanyinstancebyfield(_core_id,field,value,new_value):"+f"Error: {e}"+"\"}",_core_id) #LOGGER
        print(f"Error: {e}",_core_id) #LOGGER
        return '500'  
    # Return '500' in case of any error during the update

""" TARGET MANAGER OPERATIONS """

#Target Manager
@app.route('/<_core_id>/t', methods=['POST'])
@orm.db_session
def insertrecord(_core_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"insertrecord(_core_id): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    try:
        data = request.get_json()  # Assuming the client sends JSON data in the request body
        with orm.db_session:
            # Create a new Target entity using the provided JSON data
            new_record = Utility.Target(_st=data.get('_st'),
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
            
        Utility.Log.insert_log(f"{request}",
                        f'{data.get("_n",_core_id)} inserted success',
                        action.INSERT.value,
                        str(datetime.now()),
                        action.SUCCESS.value,
                        "{\"msg\":\"insertrecord(_core_id): 200"+"\"}",_core_id) #LOGGER
        return '200'  # Return '200' to indicate successful insertion
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                    f' failed to insert {data.get("_n",_core_id)}',
                    action.INSERT.value,
                    str(datetime.now()),
                    action.ERROR.value,
                    "{\"msg\":\"insertrecord(_core_id): 500 "+f"Error: {e}"+"\"}",_core_id) #LOGGER
        return '500'  # Return '500' in case of any error during insertion

@app.route('/<_core_id>/t/<field>/<value>', methods=['GET'])
@orm.db_session
def getrecordsbyfield(_core_id,field, value):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"getrecordsbyfield(_core_id,field, value): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve records based on the specified field and its value from the Target entity
            records = Utility.Target.select(lambda t: getattr(t, field) == value)[:]
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
                
                Utility.Log.insert_log(f"{request}",
                    f'count: {len(records)}',
                    action.GET.value,
                    str(datetime.now()),
                    action.SUCCESS.value,
                    "{\"msg\":\"getrecordsbyfield(_core_id,field, value): 200"+"\"}",_core_id) #LOGGER
                return jsonify(records_data)  # Return the records as JSON response
            else:
                
                Utility.Log.insert_log(f"{request}",
                    f'count: {len(records)}',
                    action.GET.value,
                    str(datetime.now()),
                    action.FAILED.value,
                    "{\"msg\":\"getrecordsbyfield(_core_id,field, value): 404"+"\"}",_core_id) #LOGGER
                return '404', 404  # Return '404' if no records match the criteria
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                f'count: {len(records)}',
                action.GET.value,
                str(datetime.now()),             
                action.ERROR.value,
                "{\"msg\":\"getrecordsbyfield(_core_id,field, value): 500 "+f"Error: {e}"+"\"}",_core_id) #LOGGER
        return '500', 500  # Return '500' in case of any error during retrieval

@app.route('/<_core_id>/s',methods=['POST'])
@orm.db_session
def SyncCore(_core_id):
    #->
    Utility.Log.insert_log(f"{request}",
                f'Syncing Core',
                action.GET.value,
                str(datetime.now()),             
                action.ERROR.value,
                "{\"msg\":\"SyncCore(_core_id) - Syncing Core \"}",_core_id) #LOGGER
    return Utility.sync_core(request.data)


@app.route('/<_core_id>/<_isid>/c',methods=['POST'])
@orm.db_session
def command(_core_id,_isid):
    try:

        if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
                #print(f'*******************{Utility.Sessions.session_valid(request.headers.get("authtok",_core_id) #LOGGER)}***************',request.headers.get('authtok'))
                Utility.Log.insert_log(f"{request}",
                                        f'{_isid}',
                                        action.EXEC.value,
                                        str(datetime.now()),
                                        action.FAILED.value,
                                        "{\"msg\":\"command(): 401"+"\"}",_core_id) #LOGGER
                return '401', 401
        
        target = request.get_json()
        
        if target:
            if target['_isid'] == _isid :
                command = target['_in'] 
                id = target['_id'] 
                targ = orm.select(i for i in Utility.Target if i._id == target['_id']).first()
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

                
                Utility.Log.insert_log(f"{request}",
                            f'{_isid}',
                            action.EXEC.value,
                            str(datetime.now()),
                            action.SUCCESS.value,
                            "{\"msg\":\"command(): 200"+"\"}",_core_id) #LOGGER
                socketio.emit(f's/{_isid}',f' { id } running: { command }')
                return '200', 200
        return '403', 403
    except Exception as e:
            
        Utility.Log.insert_log(f"{request}",
                        f'{_isid}',
                        action.EXEC.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"command(): 500"+f"{e}"+"\"}",_core_id) #LOGGER
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
        targ = orm.select(c for c in Utility.Target if c._isid == obj['_isid'] and c._id == obj['_id']).first()
        if targ :
            targ._st = Utility._state.COMMAND.value
            targ._in = obj['_msg']
            orm.commit()

@app.route('/<isid>/<id>/gc',methods=["GET"])
@orm.db_session
def getcmd(isid,id):
    try:
        targets  = Utility.Target.select(lambda i : i._isid == isid and int(i._id) == int(id)).first()
        if targets is not None:
            with orm.db_session:
                command = getattr(targets,attribute.IN.value)
                #set the state back to listen
                setattr(targets,attribute.STATE.value,state.LISTEN.value)
                setattr(targets,attribute.IN.value,'')
                orm.commit()
                
                Utility.Log.insert_log(f"{request}",
                                    f'{id}',
                                    action.GET.value,
                                    str(datetime.now()),
                                    action.SUCCESS.value,
                                    "{\"msg\":\" getcmd(isid,id) 200 \"}",targets._isid) #LOGGER
                return command
    except Exception as e :
        
        Utility.Log.insert_log(f"{request}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\" getcmd(isid,id) 401 \"}"+f"\n{e}",targets._isid) #LOGGER
    return '401'


@app.route('/<isid>/<id>/so',methods=["POST"])
@orm.db_session
def setout(isid,id):
    try:
        targets  = Utility.Target.select(lambda i : i._isid == isid and int(i._id) == int(id)).first()
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
                    Utility.Log.insert_log(f"{request}",
                                    f'{id}',
                                    action.GET.value,
                                    str(datetime.now()),
                                    action.SUCCESS.value,
                                    "{\"msg\":\" setout(isid,id) 200 \"}") #LOGGER
                    #orm.commit()
                    return '200'
    except Exception as e :
        
        Utility.Log.insert_log(f"{request}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\" setout(isid,id) 400 \"}"+f"\n{e}") #LOGGER
    return '404'


@app.route('/<isid>/<id>/go',methods=["GET"])
@orm.db_session
def getout(isid,id):
    try:
        print(f'{Utility.RED}*********************************************************{Utility.RESET}')
    
        print(request)
        out=''
        targets  = orm.select(i for i in Utility.Target if  i._isid == isid and int(i._id) == int(id)).first()
        with orm.db_session: 
            if targets is not None:
                Utility.Log.insert_log(f"{request}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.SUCCESS.value,
                        "{\"msg\":\" def getout(isid,id): 200 \"}",targets._isid) #LOGGER
                out = getattr(targets,attribute.OUT.value)
                setattr(targets,attribute.OUT.value,'')
                orm.commit()
                return out
    except Exception as e :
        Utility.Log.insert_log(f"{request}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\" def getout(isid,id): 401 \"}"+f"\n{e}",targets._isid) #LOGGER
    return '401'

@app.route('/<isid>/<id>/gs',methods=["GET"])
@orm.db_session 
def getstate(isid,id):
    try:
        targets  = orm.select(i for i in Utility.Target if i._isid == isid and int(i._id) == int(id)).first()
        if targets is not None:
            targets._lp = str(datetime.now())
            orm.commit()
            if targets._st == -1 :
                    
                    setattr(targets,
                            attribute.STATE.value,
                            state.LISTEN.value)
                    orm.commit()
                    return str(targets._st)
            Utility.Log.insert_log(f"{request}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.SUCCESS.value,
                        "{\"msg\":\"getstate(): 200 \"}"+f"\n",'') #LOGGER
            
            LiveViewObj = {"isid": f"{isid}", "status": '200', "time": f"{str(datetime.now())}", "msg": f"def getstate(isid,id):({id})"}
            LiveViewObjString = json.dumps(LiveViewObj)
            socketio.emit(f's/{isid}', LiveViewObjString)

            return str(targets._st)
    except Exception as e :
        
        Utility.Log.insert_log(f"{request}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"getstate(): 500 \"}"+f"\n{e}",'500') #LOGGER
    return '500'

#NEW-CLI
@app.route('/<_core_id>/<isid>/gt',methods=['GET'])
@orm.db_session
def getTargets(_core_id,isid):
    try:
        with orm.db_session:
            if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
                    #print(f'*******************{Utility.Sessions.session_valid(request.headers.get("authtok",_core_id) #LOGGER)}***************',request.headers.get('authtok'))
                Utility.Log.insert_log(f"{request}",
                                        f'{isid}',
                                        action.GET.value,
                                        str(datetime.now()),
                                        action.FAILED.value,
                                        "{\"msg\":\"idef getTargets(_core_id,isid): 401"+"\"}",_core_id) #LOGGER
                return '401', 401
            #print(isid)
            targets  = Utility.Target.select(lambda i : i._isid == isid)
            #print(len(targets))
            if targets is None :
                
                Utility.Log.insert_log(f"{request}",
                                f'{isid}',
                                action.GET.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"getTargets(): 404"+"\"}",_core_id) #LOGGER
                
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

            Utility.Log.insert_log(f"{request}",
                                f'{isid}',
                                action.GET.value,
                                str(datetime.now()),
                                action.SUCCESS.value,
                                "{\"msg\":\"getTargets(): 200"+"\"}",_core_id) #LOGGER
                
            return jsonify(records_data)
    except Exception as e :
        
        Utility.Log.insert_log(f"{request}",
                            f'{isid}',
                            action.GET.value,
                            str(datetime.now()),
                            action.ERROR.value,
                            "{\"msg\":\"getTargets(): 500 \"}"+f"\n{e}",_core_id) #LOGGER
        return "500"
    

    


@app.route('/<_core_id>/t/<int:record_id>', methods=['GET'])
@orm.db_session
def getrecordbyid(_core_id,record_id):
    #->

    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        #print(f'*******************{Utility.Sessions.session_valid(request.headers.get("authtok",_core_id) #LOGGER)}***************',request.headers.get('authtok'))
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.SUCCESS.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def getrecordbyid(_core_id,record_id): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve the record by ID from the Target entity
            target_record = Utility.Target.get(_id=record_id)

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
                
                Utility.Log.insert_log(f"{request}",
                    f'{target_record._n}',
                    action.GET.value,
                    str(datetime.now()),
                    action.SUCCESS.value,
                    "{\"msg\":\"def getrecordbyid(_core_id,record_id): 200"+"\"}",_core_id) #LOGGER
                return jsonify(record_data)  # Return the record as JSON response
            else:
                
                Utility.Log.insert_log(f"{request}",
                    f'{record_id}',
                    action.GET.value,
                    str(datetime.now()),
                    action.FAILED.value,
                    "{\"msg\":\"def getrecordbyid(_core_id,record_id): 404"+"\"}",_core_id) #LOGGER
                return '404', 404  # Return '404' if the record with the specified ID does not exist

    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                    f'{record_id}',
                    action.GET.value,
                    str(datetime.now()),
                    action.ERROR.value,
                    "{\"msg\":\"def getrecordbyid(_core_id,record_id): 500" +f"Error: {e}"+"\"}",_core_id) #LOGGER
        return '500', 500  # Return '500' in case of any error during retrieval

@app.route('/<_core_id>/<_isid>/t/all', methods=['GET'])
@orm.db_session
def getallrecords(_core_id,_isid):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def getallrecords(_core_id,_isid): 401"+"\"}",_core_id) #LOGGER
        
        LiveViewObj = {"isid": f"{_isid}", "status": '401', "time": f"{str(datetime.now())}", "msg": "invalid session"}
        LiveViewObjString = json.dumps(LiveViewObj)
        socketio.emit(f's/{_isid}', LiveViewObjString)
        return '401', 401
    try:
       
        # Retrieve all records from the Target entity
        records = orm.select(i for i in Utility.Target if i._isid == _isid )
        
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
        
        Utility.Log.insert_log(f"{request}",
                f'{_isid}',
                action.GET.value,
                str(datetime.now()),
                action.SUCCESS.value,
                "{\"msg\":\"getallrecords(): 200"+"\"}",_core_id) #LOGGER

        LiveViewObj = {"isid": f"{_isid}", "status": '200', "time": f"{str(datetime.now())}", "msg": "getalltargets()"}
        LiveViewObjString = json.dumps(LiveViewObj)
        socketio.emit(f's/{_isid}', LiveViewObjString)
        #socketio.emit(f'grid/{_isid}', LiveViewObjString)

        return jsonify(records_data), 200 # Return the records as JSON response

    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                    f'{_isid}',
                    action.GET.value,
                    str(datetime.now()),
                    action.ERROR.value,
                    "{\"msg\":\"getallrecords(): 500 "+f"Error: {e}"+"\"}",_core_id) #LOGGER
        return '500', 500  # Return '500' in case of any error during retrieval

@socketio.on('rtgrid')
@orm.db_session
def fetchInstance(message):
    data=''
    if isinstance(message, dict):
        # If message is already a dictionary
        data = message
    else:
        try:
            data = json.loads(message)
        except json.JSONDecodeError as e:
            print(f'Error parsing JSON: {e}')
            return
        


    
    records = orm.select(i for i in Utility.Target if i._isid == data['isid'] )
    records_data = [record.to_dict() for record in records]
    socketio.emit('rtgrid/'+data['isid'], records_data)



@app.route('/<_core_id>/d/t/', methods=['POST'])
@orm.db_session
def deletemultirecords(_core_id):
    try:
        if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
            Utility.Log.insert_log(f"{request}",
                                    'invalid session',
                                    action.DELETE.value,
                                    str(datetime.now()),
                                    action.FAILED.value,
                                    "{\"msg\":\"deletemultirecords(_core_id): 401"+"\"}",_core_id) #LOGGER
            return '401', 401
        data =  request.get_json()
        orm.delete(entry for entry in Utility.Target if entry._id in data)
        Utility.Log.insert_log(f"{request}",
                    f'{_core_id}',
                    action.GET.value,
                    str(datetime.now()),
                    action.SUCCESS.value,
                    "{\"msg\":\"deletemultirecords(_core_id): 200"+"\"}",_core_id) #LOGGER
        orm.commit()
        return '200',200
    except Exception as e:
        Utility.Log.insert_log(f"{request}",
                        f'coreid:{data}',
                        action.DELETE.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"deletemultirecords(_core_id): 500"+f"Error: {e}"+"\"}",_core_id) #LOGGER
        return '500'  # Return '500' in case of any error during deletion


@app.route('/<_core_id>/t/<int:record_id>', methods=['DELETE'])
@orm.db_session
def deleterecordbyid(_core_id,record_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.DELETE.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def deleterecordbyid(_core_id,record_id): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve the record by ID
            target_record = Utility.Target.get(_id=record_id)
            # Check if the record exists
            if target_record:
                # Delete the record from the database
                target_record.delete()
                orm.commit()
                
                
                Utility.Log.insert_log(f"{request}",
                        f'recordid:{record_id}',
                        action.DELETE.value,
                        str(datetime.now()),
                        action.SUCCESS.value,
                        "{\"msg\":\"deleterecordbyid(record_id): 200 "+"\"}",_core_id) #LOGGER
                return '200'  # Return '200' to indicate successful deletion
            else:    
                
                Utility.Log.insert_log(f"{request}",
                        f'recordid:{record_id}',
                        action.DELETE.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"deleterecordbyid(record_id): 404"+"\"}",_core_id) #LOGGER
                return '404'  # Return '404' if the record with the specified ID does not exist
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                        f'recordid:{record_id}',
                        action.DELETE.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"deleterecordbyid(record_id): 500"+f"Error: {e}"+"\"}",_core_id) #LOGGER
        return '500'  # Return '500' in case of any error during deletion

#exportdmp
@app.route('/<_core_id>/<_isid>/exdump',methods=['GET'])
@orm.db_session
def Export_To_Dump(_core_id,_isid):
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"sleepAgent(): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    
    instance = orm.select(i for i in Utility.Instance if  i._instance_id == _isid).first()
    targets = orm.select(i for i in Utility.Target if i._isid == _isid)
    if targets:
        dumpContent = ''
        for i in targets:
            dumpContent += f"dump content for: {i._n}\n" + i._dmp
                    # Ensure the directory exists
        
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        filename = f"{instance._instance_name}_dump_{timestamp}.txt"

        os.makedirs(os.path.dirname(app.config['IMAGE_FOLDER']), exist_ok=True)
        
        upload_folder = f'upl/{_core_id}_files'
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        filename = secure_filename(filename)
        file_path = os.path.join(upload_folder, filename)


        _, file_extension = os.path.splitext(filename)



        with open(file_path, "w") as log_file:
        # Add a header to the log file
            log_file.write("Log entries for _isid: {}\n\n".format(_isid)+("****"*10)+'\n')
            content = dumpContent.replace('\\n','\n').replace('\\r','\r')
            log_file.write(content)
        
        # Get the file size
        file_size = os.path.getsize(file_path)

        Utility.Files(
                    _filename=filename,
                    _core_id=_core_id,
                    _extension=file_extension,
                    _filesize = file_size
                      )
        orm.commit()
    return "200", 200
    


@app.route('/<_isid>/<_id>/<int:sleep>/<interval>/z',methods=['GET'])
@orm.db_session
# Function to update a specific field in a record by ID
def sleepAgent(_isid, _id, sleep,interval):
    #->
    #print('***'*100)   
    target_record = orm.select(i for i in Utility.Target if i._id ==_id and i._isid==_isid).first()
    if target_record:
        if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
            
            Utility.Log.insert_log(f"{request}",
                                    'invalid session',
                                    action.INSERT.value,
                                    str(datetime.now()),
                                    action.FAILED.value,
                                    "{\"msg\":\"sleepAgent(): 401"+"\"}",target_record._core_id) #LOGGER
            return '401', 401

        try:
            # Retrieve the record by ID directly from the Targ entity
            
            # Check if the record exists

                # Update the specified field with the new value
                #print(f'**{interval}**'*100) 
                _i_bool = interval.lower() == 'true'
                if _i_bool :
                    setattr(target_record,    Utility.Attribute.STATE.value,      Utility._state.SLEEP.value)
                else :
                    setattr(target_record,    Utility.Attribute.STATE.value,      Utility._state.INTERVAL.value)
                setattr(target_record,    Utility.Attribute.INTERVAL.value,    sleep)
                orm.commit()
                Utility.Log.insert_log(f"{request}",
                            f'count:{target_record._n}',
                            action.GET.value,
                            str(datetime.now()),
                            action.SUCCESS.value,
                            "{\"msg\":\"sleepAgent(id, field, value): 200 "+"\"}",target_record._core_id) #LOGGER
                return '200'  # Return True to indicate successful update
            
        except Exception as e:
            Utility.Log.insert_log(f"{request}",
                                    'count:0',
                                    action.GET.value,
                                    str(datetime.now()),
                                    action.ERROR.value,
                                    "{\"msg\":\"sleepAgent(id, field, value): 500"+f"Error: {e}"+"\"}",target_record._core_id) #LOGGER
            return '500'  
    else:
                Utility.Log.insert_log(f"{request}",
                            'count:0',
                            action.GET.value,
                            str(datetime.now()),
                            action.FAILED.value,
                            "{\"msg\":\"sleepAgent(id, field, value): 404 "+"\"}",target_record._core_id) #LOGGER
                return '404'  # Return False if the record with the specified ID does not exist


@app.route('/<_core_id>/t/<id>/<field>/<value>')
@orm.db_session
# Function to update a specific field in a record by ID
def updatesinglerecordbyid(_core_id,id, field, value):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"insertinstance(): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    
    # Retrieve the record by ID directly from the Targ entity
    target_record = orm.select(i for i in Utility.Target if i._id == id).first()
    print(f"id: {id} field: {field} value:{value}",_core_id) #LOGGER
    # Check if the record exists
    if target_record:
        # Update the specified field with the new value
        target_record.assign_value(field, value)
        orm.commit()
        Utility.Log.insert_log(f"{request}",
                    f'count:{target_record._n}',
                    action.GET.value,
                    str(datetime.now()),
                    action.SUCCESS.value,
                    "{\"msg\":\"updatesinglerecordbyid(id, field, value): 200 "+"\"}",_core_id) #LOGGER
        return '200'  # Return True to indicate successful update
    
    else:
        
        Utility.Log.insert_log(f"{request}",
                    'count:0',
                    action.GET.value,
                    str(datetime.now()),
                    action.FAILED.value,
                    "{\"msg\":\"updatesinglerecordbyid(id, field, value): 404 "+"\"}",_core_id) #LOGGER
        return '404'  # Return False if the record with the specified ID does not exist



@app.route('/<isid>/<id>/gz',methods=['GET'])
@orm.db_session
def getsleep(isid,id):
    try:
        targets  = Utility.Target.select(lambda i : i._isid == isid and int(i._id) == int(id)).first()
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
                                    "{\"msg\":\" def getsleep(isid,id): 200 \"}",targets._core_id) #LOGGER
                #print('*8*8'*1000)
                return f'{sleep}'
    except Exception as e :
        Utility.Log.insert_log(f"{isid}",
                        f'{id}',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\" def getsleep(isid,id): 400 \"}"+f"\n{e}",targets._core_id) #LOGGER
        return '500'



@app.route('/<_core_id>/t/<field>/<value>/<new_value>', methods=['PUT'])
@orm.db_session
def updatemanyrecordsbyfield(_core_id,field,value,new_value):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def updatemanyrecordsbyfield(_core_id,field,value,new_value):401"+"\"}",_core_id) #LOGGER
        return '401', 401
    try:
        with orm.db_session:
            # Retrieve records based on the specified field and its current value
            records_to_update = Utility.Target.select(lambda t: getattr(t, field) == value)[:]
            # Check if any records match the criteria
            if records_to_update:
                # Update the specified field with the new value for all matching records
                for record in records_to_update:
                    setattr(record, field, new_value)
                orm.commit()
                
                Utility.Log.insert_log(f"{request}",
                        f'count:{len(records_to_update)}',
                        action.GET.value,
                        str(datetime.now()),
                        action.SUCCESS.value,
                        "{\"msg\":\"updatemanyrecordsbyfield(field,value,new_value): 200"+"\"}",_core_id) #LOGGER
                return '200'  # Return '200' to indicate successful update
            else:
                
                Utility.Log.insert_log(f"{request}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"updatemanyrecordsbyfield(field,value,new_value): 404"+"\"}",_core_id) #LOGGER
                return '404'  # Return '404' if no records match the criteria
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"updatemanyrecordsbyfield(field,value,new_value): 500"+f"Error: {e}"+"\"}",_core_id) #LOGGER

        return '500'  
    
# Return '500' in case of any error during the update


""" SESSION MANAGEMENT """
@app.route('/ss/<_core_id>', methods=['GET'])
@orm.db_session
def CheckingSession(_core_id):
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"CheckingSession(_core_id): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    return '200', 200

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
                        "{\"msg\":\"checksessions(session_token): 200 "+"\"}","system") #LOGGER
        return '200'
    else:
        
        Utility.Log.insert_log("",
                        f'{session_token}',
                        action.GET.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"checksessions(session_token): 400 "+"\"}","system") #LOGGER
        return '400'
    
""" LISTENER """
@app.route('/<_core_id>/al', methods=['POST'])
@orm.db_session
def pinglistener(_core_id):
    try:

        if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
            
            Utility.Log.insert_log(f"{request}",
                                    'invalid session',
                                    action.INSERT.value,
                                    str(datetime.now()),
                                    action.FAILED.value,
                                    "{\"msg\":\"def pinglistener(_core_id): 401"+"\"}",_core_id) #LOGGER
            return '401', 401
        
        print('pinging listener')
        #ping the Listener here.



        ##BUILD PING AGENT HERE###SCAPY?

        data =  request.get_json()
        #data =  request.json()
        if data :
            _core_id =  data["_core_id"]
            _listener_name =  data["_listener_name"]
            _listener_IpAddress =  data["_ipaddress"]
            _last_ping =  data["_last_ping"]
            # ping the listner
            Utility.Listeners.insert_Listener(_core_id,_listener_name,_listener_IpAddress,_last_ping)
            orm.commit()   
            
            Utility.Log.insert_log(f"{request}",
                            'invalid session',
                            action.INSERT.value,
                            str(datetime.now()),
                            action.SUCCESS.value,
                            "{\"msg\":\"def pinglistener(_core_id): 401"+"\"}",_core_id) #LOGGER
        listeners = orm.select(i for i in Utility.Listeners if i._core_id == _core_id )  
        records_data = [record.to_dict() for record in listeners]
        t = jsonify(records_data)
        Utility.Log.insert_log(f"{request}",
                                'getallisteners',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.SUCCESS.value,
                                "{\"msg\":\"def getListeners(_core_id): 200"+"\"}",_core_id) #LOGGER        
        return  t, 200
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"def pinglistener(_core_id): 500"+f"Error: {e}"+"\"}",_core_id) #LOGGER

        return '500'  , 500

# @app.route('/<_core_id>/gl', methods=['GET'])
# @orm.db_session
# def getlisteners(_core_id):
#     try:
#         if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
#             Utility.Log.insert_log(f"{request}",
#                                     'invalid session',
#                                     action.INSERT.value,
#                                     str(datetime.now()),
#                                     action.FAILED.value,
#                                     "{\"msg\":\"def getlisteners(_core_id): 401"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
#             return '401', 401 
#         lis =  orm.select(i for i in Utility.Listeners if i._core_id == _core_id)
#         if lis :
#             return jsonify(lis), 200
#         return '404', 404
#     except Exception as e:
#         Utility.Log.insert_log(f"{request}",
#                         'count:0',
#                         action.GET.value,
#                         str(datetime.now()),
#                         action.ERROR.value,
#                         "{\"msg\":\"def getlisteners(_core_id): 500"+f"Error: {e}"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
#         return '500'  ,500


@app.route('/<_core_id>/dl/<id>', methods=['DELETE'])
@orm.db_session
def deleteListener(_core_id,id):
    try:
        if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
            
            Utility.Log.insert_log(f"{request}",
                                    'invalid session',
                                    action.INSERT.value,
                                    str(datetime.now()),
                                    action.FAILED.value,
                                    "{\"msg\":\"def deleteListener(_core_id,id): 401"+"\"}",_core_id) #LOGGER
            return '401', 401
        
        with orm.db_session:
            listener = Utility.Listeners.get(_id=id)
            # Check if the record exists
            if listener:
                # Delete the record from the database
                listener.delete()
        listeners = orm.select(i for i in Utility.Listeners if i._core_id == _core_id )  
        records_data = [record.to_dict() for record in listeners]
        t = jsonify(records_data)
        Utility.Log.insert_log(f"{request}",
                                'getallisteners',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.SUCCESS.value,
                                "{\"msg\":\"def getListeners(_core_id): 200"+"\"}",_core_id) #LOGGER
        print(t)
        return  t, 200
        
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"def deleteListener(_core_id,id): 500"+f"Error: {e}"+"\"}",_core_id) #LOGGER

        return '500'  


@app.route('/<_core_id>/gl', methods=['GET'])
@orm.db_session
def getListeners(_core_id):
    try:

        if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
            
            Utility.Log.insert_log(f"{request}",
                                    'invalid session',
                                    action.INSERT.value,
                                    str(datetime.now()),
                                    action.FAILED.value,
                                    "{\"msg\":\"def getListeners(_core_id): 401"+"\"}",_core_id) #LOGGER
            return '401', 401
        listeners = orm.select(i for i in Utility.Listeners if i._core_id == _core_id )  
        records_data = [record.to_dict() for record in listeners]
        Utility.Log.insert_log(f"{request}",
                                'getallisteners',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.SUCCESS.value,
                                "{\"msg\":\"def getListeners(_core_id): 200"+"\"}",_core_id) #LOGGER
        if listeners :
            return  jsonify(records_data), 200
        else:
            return jsonify([]), 200
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"def getListeners(_core_id): 500"+f"Error: {e}"+"\"}",_core_id) #LOGGER

        return '500'  



""" SAVE CONFIGURATION """
@app.route('/<_core_id>/sconf', methods=['POST'])
@orm.db_session
def setconfigurations(_core_id):
    try:
        if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
            Utility.Log.insert_log(f"{request}",
                                    'invalid session',
                                    action.INSERT.value,
                                    str(datetime.now()),
                                    action.FAILED.value,
                                    "{\"msg\":\"def setconfigurations(_core_id): 401"+"\"}",_core_id) #LOGGER
            return '401', 401
        with orm.db_session:
            data = request.get_json()
            if data :
                configuration = orm.select(i for i in Utility.Configuration if i._core_id == _core_id).first()# Check if the configuration with the specified core_id exists
                if configuration:

                    # configuration._log_ret_days = data["_log_ret_days"]
                    # configuration._redirect_to_dump = data["_redirect_to_dump"]
                    # configuration._session_len = data["_session_len"]
                    # configuration._create_on_ping = data["_create_on_ping"]
                    # configuration._use_http = data["_use_http"]
                    # configuration._log_create = data["_log_create"]
                    # configuration._log_delete = data["_log_delete"]
                    # configuration._log_commands = data["_log_commands"]
                    # configuration._log_pings = data["_log_pings"]
                    # configuration._inactivitytimeou = data["_inactivitytimeout"]
                      # Update the attributes of the configuration entity with new_data
                    for key, value in data.items():
                        setattr(configuration, key, value)

                    Utility.Log.insert_log(f"{request}",
                                        f'saved configuration for: {_core_id}',
                                        action.INSERT.value,
                                        str(datetime.now()),
                                        action.SUCCESS.value,
                                        "{\"msg\":\"def setconfigurations(_core_id): 200 data: "+str(data)+"\"}",_core_id) #LOGGER
                    
                    return '200', 200    
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"def setconfigurations(_core_id): 500"+f" Error: {e}"+"\"}",_core_id) #LOGGER

        return '500'  ,500

@app.route('/<_core_id>/cl', methods=['GET'])
@orm.db_session
def ClearLogs(_core_id):
    try:
        if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
            Utility.Log.insert_log(f"{request}",
                                    'invalid session',
                                    action.INSERT.value,
                                    str(datetime.now()),
                                    action.FAILED.value,
                                    "{\"msg\":\"def ClearLogs(_core_id): 401"+"\"}",_core_id) #LOGGER
            return '401', 401 
        numberofrecords = orm.count(entry for entry in Utility.Log if entry._core_id == _core_id)
        orm.delete(entry for entry in Utility.Log if entry._core_id == _core_id)
        Utility.Log.insert_log(f"{request}",
                            f'{_core_id}',
                            action.GET.value,
                            str(datetime.now()),
                            action.SUCCESS.value,
                            "{\"msg\":\"ClearLogs(_core_id): 200"+"\"}",_core_id) #LOGGER
        orm.commit()
        # print(numberofrecords , '**********************88')
        return f'{numberofrecords}',200
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"def ClearLogs(_core_id): 500"+f"Error: {e}"+"\"}",_core_id) #LOGGER

        return '500'  ,500


""" ATHENTICATION MANAGER OPERATIONS """

@app.route('/<_core_id>/usrmgr/<int:operation>', methods=['POST'])
@orm.db_session
def usrmgr(_core_id,operation):
    try:
        if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
            Utility.Log.insert_log(f"{request}",
                                    'invalid session',
                                    action.INSERT.value,
                                    str(datetime.now()),
                                    action.FAILED.value,
                                    "{\"msg\":\"def usrmgr(_core_id,operation): 401"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
            return '401', 401 
            
        data = request.get_json()
        
        if data :
        

            if operation == 1 :
                usrname  = data['username']
                pwd = data['password']
                randstring = Utility.generate_random_string(18)    
            
                if not Utility.create_user(usrname,pwd,_core_id,randstring):
                    Utility.Log.insert_log(
                        f"{request}",
                        'create_user():',
                        action.GET.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"def usrmgr(_core_id,operation): "+"\"}",_core_id) #LOGGER
                    return  "403",403
   
                #create our abstract user
                Utility.User.insert_user(randstring,usrname,_core_id)
                Utility.Log.insert_log(f"{request}",
                                    'invalid session',
                                    action.DELETE.value,
                                    str(datetime.now()),
                                    action.SUCCESS.value,
                                    "{\"msg\":\"def usrmgr(_core_id,operation): 401"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
            elif operation == 0 :
                hashid = data['_hash_id']

                with orm.db_session:
                    hashid = data["_hash_id"]
                    usr = Utility.User.get(_hash_id=hashid)
                    # Check if the record exists
                    if usr:
                        # Delete the record from the database
                        usr.delete()
                        Utility.Log.insert_log(f"{request}",
                                    'invalid session',
                                    action.DELETE.value,
                                    str(datetime.now()),
                                    action.SUCCESS.value,
                                    "{\"msg\":\"def usrmgr(_core_id,operation): 200"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
                    hashValue = Utility.Hashtable.get(_hash_id=hashid)
                    if hashValue:
                        # Delete the record from the database
                        hashValue.delete()
                        Utility.Log.insert_log(f"{request}",
                                    'invalid session',
                                    action.DELETE.value,
                                    str(datetime.now()),
                                    action.SUCCESS.value,
                                    "{\"msg\":\"def usrmgr(_core_id,operation): 200"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
            else:
                Utility.Log.insert_log(f"{request}",
                                        'bad request',
                                        action.INSERT.value,
                                        str(datetime.now()),
                                        action.SUCCESS.value,
                                        "{\"msg\":\"def create_core(_core_id,operation): 404"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
                return '404', 404 
            
        allUser = orm.select(i for i in Utility.User if i._core_id == _core_id )  
        records_data = [record.to_dict() for record in allUser]
        t = jsonify(records_data)
        Utility.Log.insert_log(f"{request}",
                                'getallisteners',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.SUCCESS.value,
                                "{\"msg\":\"def getListeners(_core_id): 200"+"\"}",_core_id) #LOGGER
        return t , 200

    except Exception as e:

        Utility.Log.insert_log(f"{request}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"def create_core(_core_id,operation): 500"+f"Error: {e}"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER

        return '404'  ,404
    

@app.route('/<_core_id>/<usr>', methods=['GET'])
@orm.db_session
def CheckUserExists(_core_id,usr):
    if Utility.Hashtable.UserExists(usr): 
        Utility.Log.insert_log(f"{_core_id}",
            'create_user():',
            action.GET.value,
            str(datetime.now()),
            action.FAILED.value,
            "{\"msg\":\"def CheckUserExists(_core_id,usr):'Already Exists'} "+"\"}",_core_id) #LOGGER
        return "403", 403
    return "200", 200
            

@app.route('/cc', methods=['POST'])
@orm.db_session
def create_core():
    data = request.get_json()
    try:
        if data :
                # Ensure that data is a dictionary
            print(data)
            if not isinstance(data, dict):
                return jsonify({'error': 'Invalid JSON data'}), 400
            # Now you can safely access dictionary keys
            usr = data.get("_username", None)
            usr = data["_username"]
            password = data["_password"]
            randstring = Utility.generate_random_string(18)
            coreid = Utility.Guid()
            Utility.Core.insert_core(coreid)
            Utility.Instance.insert_instance(0,Utility.generate_random_string(10),"default",data["_address"],data["_hostname"],0,coreid)
            Utility.Configuration.insert_Configuration(30,0,data["_hostname"],data["_hostname"],data["_address"],data["_port"],"3453453453",coreid,30,0,0,0,0,0,0,0)
            
            if not Utility.create_user(usr,password,coreid,randstring):
                Utility.Log.insert_log(f"{coreid}",
                    'create_user():',
                    action.GET.value,
                    str(datetime.now()),
                    action.FAILED.value,
                    "{\"msg\":\"create_user(): 401 'error': 'Already Exists'} "+"\"}",coreid) #LOGGER
                return 401, "400"
            
            #creates abstract user
            Utility.User.insert_user(randstring,usr,coreid)
            
            orm.commit()     
            Utility.Log.insert_log("",
                        f'created: {coreid}',
                        action.GET.value,
                        str(datetime.now()),
                        action.SUCCESS.value,
                        "{\"msg\":\"create_core(): 200 "+"\"}",coreid) #LOGGER
        #{"_title":"Title","_hostname":"com.mother.Ship.com","_address":"10.0.0.10","_port":":5675","_username":"username","_password":"password","_confirm":"password"}
        return "200", 200
    except Exception as e:
        Utility.Log.insert_log("",
                        f'Creation Failed',
                        action.GET.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"create_core(): 500 "+"\"}",coreid) #LOGGER
        return  jsonify({'error': f' error :{e}'}), 500

@app.route('/<_core_id>/c/u', methods=['POST'])
@orm.db_session
def create_user(_core_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def create_user(_core_id): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    
    data = request.get_json()

    if 'password' not in data or 'username' not in data or 'hash_id' not in data:
        
        Utility.Log.insert_log("",
                        'create_user',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"def create_user(): 400 {'error': 'Missing required fields'}"+"\"}",_core_id) #LOGGER
        return  400
    if Utility.Hashtable.Authenticate(data["password"],data["username"])[1]:
        
        Utility.Log.insert_log(f"{request}",
                        'create_user',
                        action.GET.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"create_user(): 401 {'error': 'Already Exists'}"+"\"}",_core_id) #LOGGER
        return 401
    try:
        Utility.Hashtable.insert(data['password'],data['username'],_core_id)

        
        Utility.Log.insert_log(f"{request}",
                'create_user',
                action.GET.value,
                str(datetime.now()),
                action.SUCCESS.value,
                "{\"msg\":\"create_user(): 200 {'message': 'user created successfully'}"+"\"}",_core_id) #LOGGER
        return  201
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                'create_user',
                action.GET.value,
                str(datetime.now()),
                action.ERROR.value,
                "{\"msg\":\"def create_user(): 500 "+f"{'error': str(e)}"+"\"}",_core_id) #LOGGER
        return  500


@app.route('/<_core_id>/c/u/c', methods=['POST'])
@orm.db_session
def create_user_core(_core_id):
    #->
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def create_user_core(_core_id): 401"+"\"}",_core_id) #LOGGER
        return '401', 401
    data = request.get_json()
    if 'password' not in data or 'username' not in data or 'core_id' not in data:
        
        Utility.Log.insert_log(f"{request}",
                'create_user_core():',
                action.GET.value,
                str(datetime.now()),
                action.FAILED.value,
                "{\"msg\":\"create_user_core(): 400 {'error': 'Missing required fields'}"+"\"}",_core_id) #LOGGER
        return  400
    if Utility.Hashtable.Authenticate(data["password"],data["username"])[1]:
        
        Utility.Log.insert_log(f"{request}",
                'create_user_core():',
                action.GET.value,
                str(datetime.now()),
                action.FAILED.value,
                "{\"msg\":\"create_user_core(): 401 'error': 'Already Exists'} "+"\"}",_core_id) #LOGGER
        return  401
    try:
        Utility.Hashtable.insert_core_user(data['password'],data['username'],data['core_id'])
        
        Utility.Log.insert_log(f"{request}",
                'create_user_core():',
                action.GET.value,
                str(datetime.now()),
                action.SUCCESS.value,
                "{\"msg\":\"create_user_core(): 201 {'message': 'user created successfully'}"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
        return  201
    except Exception as e:
        
        Utility.Log.insert_log(f"{request}",
                'create_user_core():',
                action.GET.value,
                str(datetime.now()),
                action.ERROR.value,
                "{\"msg\":\"def create_user_core(): 201 "+f"{'error': str(e)}"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
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
            core, _core_id = Utility.return_core(c,s)
            if core :
                
                Utility.Log.insert_log(f"{request}",
                            'login_end_point():',
                            action.GET.value,
                            str(datetime.now()),
                            action.AUTHENTICATED.value,
                            "{\"msg\":\"login_end_point(): 200 core: "+core+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
                return core
            
            Utility.Log.insert_log(f"{request}",
                        'login_end_point():',
                        action.GET.value,
                        str(datetime.now()),
                        action.FAILED.value,
                        "{\"msg\":\"login_end_point() !core? : 500"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
            return "500"
        else:
            Utility.Log.insert_log("",
                        'login_end_point():',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"login_end_point(): failed login"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
            # Do something else if the condition is false
            return '500'
    except Exception as e:
        
        Utility.Log.insert_log("",
            'login_end_point():',
            action.GET.value,
            str(datetime.now()),
            action.ERROR.value,
            "{\"msg\":\"login_end_point(): 500"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
            # Do something else if the condition is false
        return '500'


def allowed_file(filename):
    # Check for the specified extensions
    if '.' in filename:
        extension = filename.rsplit('.', 1)[1].lower()
        if extension in ALLOWED_EXTENSIONS:
            return True
    
    # Check for any 1-10 letter extension
    if '.' in filename and 1 <= len(filename.rsplit('.', 1)[1]) <= 10:
        return True
    
    return False

@app.route('/<_core_id>/upl/ph/<filename>')

def get_image(_core_id,filename):
    Utility.Log.insert_log("",
                    'get_image():',
                    action.GET.value,
                    str(datetime.now()),
                    action.GET.value,
                    "{\"msg\":\"get_image(filename): getting image"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
    
    file_extension = os.path.splitext(filename)[1]
    mimetype_mapping = {
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'bmp': 'image/bmp',
        # Add more formats as needed
    }

    # Use the provided image format to get the corresponding mimetype
    mimetype = mimetype_mapping.get(file_extension, 'image/jpeg')

    # Use send_from_directory to serve the image from the specified directory
    return send_file(f'./upl/{_core_id}_files/{filename}', mimetype=mimetype)

@app.route('/<_core_id>/upload/gf', methods=['POST'])
@orm.db_session
def download_files(_core_id):
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"download_files(): 401"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
        return '401', 401
    data = request.get_json() 
    directory_path =f'upl/{_core_id}_files'
    if len(data) > 0 : 
        zip_path = f'/{directory_path}/{_core_id}_compressed.zip'
        with ZipFile(zip_path, 'w') as zipf:
            for file_name in data:
                file_path = os.path.join(directory_path, file_name)
                zipf.write(file_path, file_name)
        response = send_file(zip_path, as_attachment=True, download_name=f'{_core_id}_compressed.zip')
        os.remove(zip_path)
        return response, 200
    else:
        Utility.Log.insert_log("",
            'login_end_point():',
            action.GET.value,
            str(datetime.now()),
            action.ERROR.value,
            "{\"msg\":\"download_files(_core_id): 500"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
            # Do something else if the condition is false
        return '500', 500

@app.route('/<_core_id>/upload', methods=['POST'])
@orm.db_session
def upload_file(_core_id):
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
    
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def upload_file(_core_id): 401"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
        return '401', 401
    #print(request.data['file'])
    if  request.data is None:
        
        Utility.Log.insert_log("",
                    'upload_file():',
                    action.GET.value,
                    str(datetime.now()),
                    action.FAILED.value,
                    "{\"msg\":\"get_image(filename): no file"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
        return '403', 403

    file = request.files['file']

    if file.filename == '':
        
        Utility.Log.insert_log("",
                    'upload_file():',
                    action.GET.value,
                    str(datetime.now()),
                    action.FAILED.value,
                    "{\"msg\":\"get_image(filename): filename empty"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
        return '403', 403


    filetemp = Utility.Files.select(lambda i : i._filename == file.filename).first()

    if filetemp :
        Utility.Log.insert_log("",
                    'upload_file():',
                    action.GET.value,
                    str(datetime.now()),
                    action.FAILED.value,
                    "{\"msg\":\"get_image(filename): File already exists"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
        return  '405 File exists'
    

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        fpath = os.path.join(app.config['IMAGE_FOLDER'], filename)
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(app.config['IMAGE_FOLDER']), exist_ok=True)
        
        upload_folder = f'upl/{_core_id}_files'
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)



        _, file_extension = os.path.splitext(filename)

        # Get the file size
        file_size = os.path.getsize(file_path)

        Utility.Files(
                    _filename=filename,
                    _core_id=_core_id,
                    _extension=file_extension,
                    _filesize = file_size
                      )
        orm.commit()
        
        Utility.Log.insert_log("",
                'upload_file():',
                action.GET.value,
                str(datetime.now()),
                action.SUCCESS.value,
                "{\"msg\":\"get_image(filename): fileuploaded"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
        
        return '200'
    
    Utility.Log.insert_log("",
                    'upload_file():',
                    action.GET.value,
                    str(datetime.now()),
                    action.ERROR.value,
                    "{\"msg\":\"get_image(filename): invalid file type"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
    return '405'




@app.route('/<_core_id>/uploads/del', methods=['POST'])
@orm.db_session
def delete_files(_core_id):

    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def delete_files(_core_id): 401"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
        return '401', 401
    data = request.get_json() 
    directory_path =f'upl/{_core_id}_files'
    if len(data) > 0 : 
        for file_name in data:
            file_path = os.path.join(directory_path, file_name)
            try:
                os.remove(file_path)
                print(f"File {file_name} deleted successfully.",_core_id) #LOGGE,_core_idR #LOGGER
                f = Utility.Files.select(lambda i : i._filename == file_name).first()
                f.delete()
                orm.commit()
                Utility.Log.insert_log("",
                    'delete_files():',
                    action.GET.value,
                    str(datetime.now()),
                    action.SUCCESS.value,
                    "{\"msg\":\"def delete_files(_core_id):"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
            except OSError as e:
                errorstr = f"msg:def delete_files(_core_id) Error deleting {file_name}: {e.strerror}"
                Utility.Log.insert_log("",
                    'delete_files():',
                    action.GET.value,
                    str(datetime.now()),
                    action.ERROR.value,
                    errorstr)
                return '500', 500
    return '200', 200

#icci
@app.route('/<_core_id>/dir',methods=['GET'])
def get_directory_structure(_core_id):
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def get_directory_structure(_core_id):401"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
        return '401', 401
  

    Utility.Log.insert_log("",
                    'def get_directory_structure(_core_id):',
                    action.GET.value,
                    str(datetime.now()),
                    action.SUCCESS.value,
                    "{\"msg\":\"def get_directory_structure(_core_id):"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
        
    DirectoryStructur = Utility.BuildStorageObjects(_core_id)
    return DirectoryStructur
        

@app.route('/upl/<_core_id>/<filename>', methods=['GET']) 
def getfilecontent(_core_id,filename):
    if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
        Utility.Log.insert_log(f"{request}",
                                'invalid session',
                                action.INSERT.value,
                                str(datetime.now()),
                                action.FAILED.value,
                                "{\"msg\":\"def getfilecontent(_core_id,filename):401"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
        return '401', 401
    try:
        current_path = os.getcwd()
        upload_folder = f'{current_path}/upl/{_core_id}'

        with open(f'{upload_folder}/{filename}', 'r') as f:
            Utility.Log.insert_log("",
                    'def getfilecontent(_core_id,filename)::',
                    action.GET.value,
                    str(datetime.now()),
                    action.SUCCESS.value,
                    "{\"msg\":\"def getfilecontent(_core_id,filename)::"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
            return f.read(), 200
    except Exception as e:
        Utility.Log.insert_log("",
            'getfilecontent():',
            action.GET.value,
            str(datetime.now()),
            action.ERROR.value,
            "{\"msg\":\"def getfilecontent(_core_id,filename): 500, exception: \""+f"{e}"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
            # Do something else if the condition is false
    return '500', 500
    

"""

Use this template when defining server side handlers

    <Precode? bad idea before authchecking>
...
    
    try:
        if not Utility.Sessions.session_valid(request.headers.get('authtok')) :
       Utility.Log.insert_log(f"{request}",
                                    'invalid session',
                                    action.INSERT.value,
                                    str(datetime.now()),
                                    action.FAILED.value,
                                    "{\"msg\":\"def FunctionName() 401"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER
            return '401', 401 

        <OTHER CODE>

    except Exception as e:
        
   Utility.Log.insert_log(f"{request}",
                        'count:0',
                        action.GET.value,
                        str(datetime.now()),
                        action.ERROR.value,
                        "{\"msg\":\"def FunctionName(): 500"+f"Error: {e}"+"\"}",_core_id) #LOGGE,_core_idR #LOGGER

        return '500'  ,500
"""
# # Example usage of the update_field_by_id function
# record_id = 1  # Replace with the desired record ID
# field_to_update = "_lp"  # Replace with the name of the field you want to update
# new_value = "new_value"  # Replace with the new value for the field
# # Call the update_field_by_id function
# success = update_field_by_id(record_id, field_to_update, new_value)
if '__main__' == __name__:
# Call the create_target_table function to create the Target table if it does not exist
    print(f'{Utility.YELLOW}* CONFIGURING SERVER{Utility.RESET}')
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
    #FIRE IT UP BABY!!!
    print(f'{Utility.GREEN}* SPINNING SERVER UP{Utility.RESET}')
    socketio.run(app,host=host, port=port,debug=True)