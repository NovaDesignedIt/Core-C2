/*///////////////////////////////////////////////////////////////////////////////////
                   MAIN WEBCLIENT API CLASS TO MANAGE THE CALLS.
///////////////////////////////////////////////////////////////////////////////////*/

export interface CoreInterface {
  core: Core;
}



export class Target {

  _ip: string;
  _st: number;
  _dmp: string;
  _in: string;
  _out: string;
  _lp: string;
  _id: number;
  _isid: string;
  _zzz: number;
  _n: string;

  constructor(
    _ip = '',
    _st = 0,
    _dmp = '',
    _in = '',
    _out = '',
    _lp = '',
    _id = 0,
    _isid = '',
    _zzz = 0,
    _n = '',
  ) {
    this._ip = _ip
    this._st = _st
    this._dmp = _dmp
    this._in = _in
    this._out = _out
    this._lp = _lp
    this._id = _id
    this._isid = _isid
    this._zzz = _zzz
    this._n = _n

  }
}

export class User {
  _hash_id: string;
  _username: string;
  _AuthToken: string;
  _core_id: string;

  constructor(
    _hash_id = "",
    _username = "",
    _AuthToken = "",
    _core_id = "",
  ) {
    this._core_id = _core_id
    this._hash_id = _hash_id
    this._username = _username
    this._AuthToken = _AuthToken
  }
}

export class Listeners {
  _core_id: string
  _listener_name: string
  _ipaddress: string
  _last_ping: string
  _id: number

  constructor(
    _core_id = "",
    _listener_name = "",
    _ipaddress = "",
    _last_ping = "",
    _id = 0,

  ) {
    this._core_id = _core_id
    this._listener_name = _listener_name
    this._ipaddress = _ipaddress
    this._last_ping = _last_ping
    this._id = _id

  }
}



export class Instance {
  _id: number;
  _instance_id: string;
  _instance_name: string;
  _proxy: number;
  _instance_url: string;
  _Instance_count: number;
  _core_id: string;

  constructor(
    _id = 0,
    _instance_id = '',
    _instance_name = '',
    _proxy = 0,
    _instance_url = '',
    _Instance_count = 0,
    _core_id = '',) {
    this._id = _id
    this._instance_id = _instance_id
    this._instance_name = _instance_name
    this._proxy = _proxy
    this._instance_url = _instance_url
    this._Instance_count = _Instance_count
    this._core_id = _core_id;

  }




}

export class Config {
  _id?: number;
  _session_len?: number;
  _theme?: number;
  _title?: string;
  _host_name?: string;
  _ip_address?: string;
  _hash_id?: string;
  _core_id?: string;
  _log_ret_days?: number;
  _redirect_to_dump?: number;
  _create_on_ping?: number;
  _use_http?: number;
  _log_create?: number;
  _log_delete?: number;
  _log_commands?: number;
  _log_pings?: number;
  _inactivitytimeout?: number;

  [key: string]: any;

  constructor(
    _id = 0,
    _session_len = 0,
    _theme = 0,
    _title = '',
    _host_name = '',
    _ip_address = '',
    _hash_id = '',
    _core_id = '',
    _log_ret_days = 0,
    _redirect_to_dump = 0,
    _create_on_ping = 0,
    _use_http = 0,
    _log_create = 0,
    _log_delete = 0,
    _log_commands = 0,
    _log_pings = 0,
    _inactivitytimeout = 0
  ) {
    this._id = _id || 0;
    this._session_len = _session_len || 0;
    this._theme = _theme || 0;
    this._title = _title || 'title';
    this._host_name = _host_name || 'name';
    this._ip_address = _ip_address || 'ipaddr';
    this._hash_id = _hash_id || 'hashid';
    this._core_id = _core_id || 'coreid';
    this._log_ret_days = _log_ret_days || 0;
    this._redirect_to_dump = _redirect_to_dump;
    this._create_on_ping = _create_on_ping;
    this._use_http = _use_http;
    this._log_create = _log_create;
    this._log_delete = _log_delete;
    this._log_commands = _log_commands;
    this._log_pings = _log_pings;
    this._inactivitytimeout = _inactivitytimeout;
  }
}

export class Logger {
  _id: string;
  _instance_id: string;
  _target_name: string;
  _action: number;
  _time: string;
  _result: number;
  _core_id: string;
  _target_id: number;
  _msg: string;

  constructor(
    _id = '',
    _instance_id = '',
    _target_name = '',
    _action = 0,
    _time = '',
    _result = 0,
    _core_id = '',
    _target_id = 0,
    _msg = ''
  ) {

    this._id = _id || '';
    this._instance_id = _instance_id || '';
    this._target_name = _target_name || '';
    this._action = _action || 0;
    this._time = _time || '';
    this._result = _result || 0;
    this._core_id = _core_id || '';
    this._target_id = _target_id || 0;
    this._msg = _msg || '';
  }
}

export class CoreC {
  _sessiontoken: string;
  _core_id: string;
  _user: string;
  _url: string;

  constructor(
    _sessiontoken = '',
    _core_id = '',
    user = '',
    url = ''
  ) {
    this._sessiontoken = _sessiontoken;
    this._core_id = _core_id;
    this._user = user;
    this._url = url;
  }

}

export class Core {
  _core_c?: CoreC;
  _sessiontoken: string;
  _core_id: string;
  _config?: Config;
  _instances?: Instance[];
  _listeners?: Listeners[];
  _rootdir?: Root;
  _users?: User[];
  _user: string;
  _url: string;

  constructor(
    _core_c?: CoreC,
    _sessiontoken = '',
    _core_id = '',
    _config?: Config,
    _instances?: Instance[],
    _listeners?: Listeners[],
    _rootdir?: Root,
    _users?: User[],
    user = '',
    url = ''
  ) {
    this._core_c = _core_c;
    this._sessiontoken = _sessiontoken;
    this._core_id = _core_id;
    this._config = _config;
    this._instances = _instances;
    this._listeners = _listeners
    this._rootdir = _rootdir;
    this._users = _users;
    this._user = user;
    this._url = url;
  }


  addInstance(instance: Instance): void {
    // Check if the instance doesn't already exist
    if (this._instances !== undefined) {
      if (!this._instances.some((existingInstance) => existingInstance._id === instance._id)) {
        // Add the new instance to the array
        this._instances.push(instance);
      }
    }
  }

  deleteInstance(instanceId: number): void {
    // Find the index of the instance with the given ID
    if (this._instances !== undefined) {
      const index = this._instances.findIndex((instance) => instance._id === instanceId);

      // If the instance exists, remove it from the array
      if (index !== -1) {
        this._instances.splice(index, 1);
      }
    }
  }

  config() {
    return this._config;
  }

  id() {
    return this._core_id;
  }

  token() {
    return this._sessiontoken;
  }

}


export class Root {
  _path: string;
  _core_id: string;
  _filecount: number;
  _files: File[];

  constructor(
    _path = '',
    _core_id = '',
    _filecount = 0,
    _files = [new File(),],
  ) {
    this._core_id = _core_id;
    this._filecount = 0;
    this._files = _files;
    this._path = '/' + _core_id + '/';
  }


}

export class File {
  _name: string;
  _size: number;
  _extension: string;

  constructor(
    _size = 0,
    _name = '',
    _extension = '',

  ) {
    this._size = _size;
    this._name = _name;
    this._extension = _extension;
  }

}


export interface CoreObjects {
  core?: Core
}

/**
 * Get an instance by a specific field.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {string} recordId - The ID of the record.
 * @param {string} value - The value to match.
 * @returns {Promise<string>} A Promise with the result.
 */
export async function getinstancebyfield(url: string, core: CoreC, recordId: string, value: string): Promise<string> {
  try {
    const apiUrl = `http://${url}/${core._core_id}/i/${recordId}/${value}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      },
    });

    if (response.ok) {
      return `${response.text}`;
    } else if (response.status === 404) {
      return '404';
    } else if (response.status === 400) {
      return '400';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }
}
/**
 * Insert an instance.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {Instance} data - The Instance data.
 * @returns {Promise<string>} A Promise with the result.
 */
export async function insertinstance(url: string, core: CoreC, instance: Instance) {
  try {
    const apiUrl = `http://${url}/${core._core_id}/i`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      },
      body: JSON.stringify(instance),
    }).then(data => { return data.json() }).catch(error => console.log(error));
    //console.log(response, 'responseposdkfposdkfposdkfposdkfposdkfposdfk')
    return response

  } catch (error) {
    console.error('Error:', error);

  }

}


/**
 * Get an instance by ID.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {Instance} instance - The Instance object.
 * @returns {Promise<string>} A Promise with the result.
 */
export async function getinstancebyid(url: string, core: CoreC, instance: Instance): Promise<string> {
  try {
    const apiUrl = `http://${url}/${core._core_id}/i/${instance._id}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      }
    });

    if (response.ok || response.status == 200) {
      return `${response.text}`;
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }
}

/**
 * Get all instances.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.

 * @returns {Promise<string>} A Promise with the result.
 */
export async function getallinstance(url: string, core: CoreC): Promise<string> {
  try {
    const apiUrl = `http://${url}/${core._core_id}/i/all`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      }
    });

    if (response.ok || response.status == 200) {
      return response.json();
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }
}
/**
 * Delete an instance by ID.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {Instance} instance - The Instance object.
 * @returns {Promise<string>} A Promise with the result.
 */
export async function deleteinstancebyid(url: string, core: CoreC, instance: Instance) {
  try {
    const apiUrl = `http://${url}/${core._core_id}/i/${instance._id}`;

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      }
    }).then(data => { return data.json() }).catch(error => console.log(error));
    return response;
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }


}



/**
 * Update a single instance by ID.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {Instance} instance - The Instance object.
 * @param {string} field - The field to update.
 * @param {string} value - The new value.
 * @returns {Promise<string>} A Promise with the result.
 */
export async function updatesingleInstancebyid(url: string, core: CoreC, instance: Instance, field: string, value: string): Promise<string> {
  try {
    const apiUrl = `http://${url}/${core._core_id}/i/${instance._id}/${field}/${value}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      }
    });

    if (response.ok || response.status == 200) {
      return `${response.text}`;
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }
}


/**
 * Update many instances by a specific field.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {string} field - The field to update.
 * @param {string} value - The value to match.
 * @param {string} new_value - The new value.
 * @returns {Promise<string>} A Promise with the result.
 */
export async function updatemanyinstancebyfield(url: string, core: CoreC, field: string, value: string, new_value: string): Promise<string> {
  try {
    const apiUrl = `http://${url}/${core._core_id}/i/${field}/${value}/${new_value}`;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      }
    });

    if (response.ok || response.status == 200) {
      return `${response.text}`;
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }
}



/**
 * Insert a record.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {Target} data - The Target data.
 * @returns {Promise<string>} A Promise with the result.
 */
export async function insertrecord(url: string, core: CoreC, data: Target): Promise<string> {
  try {
    const apiUrl = `http://${url}/${core._core_id}/t`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      },
      body: JSON.stringify(data),
    });

    if (response.ok || response.status == 200) {
      return `200`;
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }
}

/**
 * Get records by a specific field.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {string} field - The field to query.
 * @param {string} value - The value to match.
 * @returns {Promise<string>} A Promise with the result.
 */
export async function getrecordsbyfield(url: string, core: CoreC, field: string, value: string): Promise<string> {
  try {
    const apiUrl = `http://${url}/${core._core_id}/t/${field}/${value}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      },
    });

    if (response.ok || response.status == 200) {
      return `${response.text}`;
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }
}

/**
 * Get a record by ID.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {string} record_id - The ID of the record to retrieve.
 * @returns {Promise<string>} A Promise with the result.
 */
export async function getrecordbyid(url: string, core: CoreC, record_id: string): Promise<Target | string> {
  try {
    const apiUrl = `http://${url}/${core._core_id}/t/${record_id}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      },
    });

    if (response.ok || response.status == 200) {
      return response.json();
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }
}


/**
 * Get all records.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Instance} [instance] - The Instance object (optional).
 * @param {Core} [core] - The Core object (optional).
 * @returns {Promise<Target[] | string>} A Promise with the result.
 */
export async function getallrecords(url: string, instance?: Instance, core?: CoreC): Promise<Target[] | string> {
  try {
    const apiUrl = `http://${url}/${core?._core_id}/${instance?._instance_id}/t/all`;
    const authoken = core?._sessiontoken ? core?._sessiontoken : ''
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authtok': authoken
      },
    });

    if (response.ok || response.status == 200) {
      return await response.json();;
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }
}

/**
 * Delete a record by ID.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {string} record_id - The ID of the record to delete.
 * @param {Core} [core] - The Core object (optional).
 * @returns {Promise<string>} A Promise with the result.
 */
export async function deleterecordbyid(url: string, records: number[], core?: CoreC,): Promise<string> {
  try {
    const apiUrl = `http://${url}/${core?._core_id}/d/t/`;
    const authoken = core?._sessiontoken ? core?._sessiontoken : ''
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authtok': authoken,
      },
      body: JSON.stringify(records)
    });

    console.log(response);
    if (response.ok || response.status == 200) {
      return '200';
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }
}


/**
 * Update a single record by ID.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {string} record_id - The ID of the record to update.
 * @param {string} field - The field to update.
 * @param {string} value - The new value.
 * @returns {Promise<string>} A Promise with the result.
 */
export async function updatesinglerecordbyid(url: string, core: CoreC, record_id: string, field: string, value: string): Promise<string> {
  try {
    const apiUrl = `http://${url}/${core._core_id}/t/${record_id}/${field}/${value}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      },
    });

    if (response.ok || response.status == 200) {
      return '200';
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }
}


/**
 * Update many records by a specific field.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {string} record_id - The ID of the records to update.
 * @param {string} field - The field to update.
 * @param {string} value - The new value.
 * @returns {Promise<string>} A Promise with the result.
 */
export async function updatemanyrecordsbyfield(url: string, core: CoreC, record_id: string, field: string, value: string): Promise<string> {
  try {
    const apiUrl = `http://${url}/${core._core_id}/t/${record_id}/${field}/${value}`;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      },
    });

    if (response.ok || response.status == 200) {
      return `200`;
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }
}



/**
 * Get a record by ID.
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {string} record_id - The ID of the record to retrieve.

 */
export async function SetCommand(url: string, core: CoreC, instance: Instance, target: Target, command: string) {
  try {
    const apiUrl = `http://${url}/${core._core_id}/${instance._instance_id}/c`;
    const payload = {
      _dmp : target._dmp,
      _id : target._id,
      _in : command,
      _ip : target._ip,
      _isid : target._isid,
      _lp : target._lp,
      _n : target._n,
      _out : target._out,
      _st : 0,
      _zzz : target._zzz
  }
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      },
      body: JSON.stringify(payload),
    }).then(data => data).catch(error => console.log(error));
  } catch (error) {
    console.log('Error:', error);
  }
}

/**
 * Fetch data from the server based on the provided instance and id.
 *
 * @param {Instance} instance - The instance object containing necessary properties.
 * @param {number} id - The numeric id parameter.
 * @returns {Promise<string>} A Promise that resolves to the fetched data or an error message.
 */
export async function fetchOut(url: string, instance: Instance, id: number): Promise<string> {

  try {
    const response = await fetch(`http://${url}/${instance._instance_id}/${id}/go`);

    if (response.ok) {
      const data = await response.text();
      return data;
    } else {
      console.error('Failed to fetch data:', response.status);
      return 'Error';
    }
  } catch (error) {
    console.error('Error during fetch:', error);
    return 'Error';
  }

}


/**
 * Downloads files from the specified URL.
 * @param {url} - The URL for the download endpoint.
 * @param {files} - An array of file names to be downloaded.
 * @param {core} - An optional Core object.
 * @returns A Promise that resolves when the download is complete.
 */
export async function downloadFiles(url: string, files: string[], core?: CoreC) {

  try {
    console.log(JSON.stringify(files));

    //alert(typeof instance)
    const apiUrl = `http://${url}/${core?._core_id}/upload/gf`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core?._sessiontoken !== undefined ? core?._sessiontoken : '',
      },
      body: JSON.stringify(files),
    });



    if (response.ok || response.status == 200) {
      return response;
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }


}


/**
 * Deletes files from the specified URL.
 * @param {url} - The URL for the delete endpoint.
 * @param {files} - An array of file names to be deleted.
 * @param {core} - An optional Core object.
 * @returns A Promise that resolves when the deletion is complete.
 */
export async function deleteFiles(url: string, files: string[], core?: CoreC) {

  try {
    console.log(JSON.stringify(files));

    //alert(typeof instance)
    const apiUrl = `http://${url}/${core?._core_id}/uploads/del`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core?._sessiontoken !== undefined ? core?._sessiontoken : '',
      },
      body: JSON.stringify(files),
    });

    //console.log(JSON.stringify(target))

    if (response.ok || response.status == 200) {
      return '200';
    } else if (response.status === 401) {
      return '401';
    } else if (response.status === 404) {
      return '404';
    } else {
      return '500';
    }
  } catch (error) {
    console.error('Error:', error);
    return '500';
  }



}



// @app.route('/<_core_id>/cl/', methods=['GET'])
// @orm.db_session
// def ClearLogs(_core_id):


/**
 * getFileContent from the specified URL.
 * @param {url} - The URL for the delete endpoint.
 * @param {CoreC} - Core Object
 * @returns A Promise that resolves when the deletion is complete.
 */
export async function ClearLogs(url: string, coreC: CoreC) {

  const response = await fetch(`http://${url}/${coreC._core_id}/cl`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Specify the content type as JSON
      'authtok': coreC?._sessiontoken !== undefined ? coreC?._sessiontoken : '',
    },
  }).then(
    async (data) => {
      return data.status === 200 ? await data.text() : 401
    }
  ).catch((error: Error) => {
    console.log(error);
  })

  return response;

}


/**
 * getFileContent from the specified URL.
 * @param {url} - The URL for the delete endpoint.
 * @param {files} - An array of file names to be deleted.
 * @param {core} - An optional Core object.
 * @returns A Promise that resolves when the deletion is complete.
 */
export async function CreateCore(url: string, coreStructure: string) {

  const response = await fetch(`http://${url}/cc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify the content type as JSON
    },
    body: coreStructure, // Convert the object to a JSON string
  }).then(
    (data) => {
      console.log(data.text())
      return data.status
    }
  ).catch((error: Error) => {
    console.log(error);
  })

  console.log(response);

}


/**
 * addlistener from the specified URL.
 * @param {url} - The URL for the delete endpoint.
 * @param {Listeners} - Listener Object
 * @param {core} - An optional Core object.
 * @returns A Promise that resolves when the deletion is complete.
 */
export async function addlistener(url: string, core: CoreC, Listener: Listeners) {
  const response = await fetch(`http://${url}/${core._core_id}/al`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify the content type as JSON
      'authtok': core?._sessiontoken !== undefined ? core?._sessiontoken : '',
    },
    body: JSON.stringify(Listener), // Convert the object to a JSON string
  }).then(
    (data) => {
      return data.json()
    }
  ).catch((error: Error) => {
    console.log(error);
  })
  return response;


}


/**
 * deleteListener from the specified URL.
 * @param {url} - The URL for the delete endpoint.
 * @param {Listeners} - Listener Object
 * @param {core} - An optional Core object.
 * @returns A Promise that resolves when the deletion is complete.
 */
export async function deleteListener(url: string, core: CoreC, id: number) {
  const response = fetch(`http://${url}/${core._core_id}/dl/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // Specify the content type as JSON
      'authtok': core?._sessiontoken !== undefined ? core?._sessiontoken : '',
    }
  }).then(
    (data) => {
      return data.json()
    }
  ).catch((error: Error) => {
    console.log(error);
  })
  return response;
}


/**
 * getalllisteners from the specified URL.
 * @param {url} - The URL for the delete endpoint.
 * @param {core} - An optional Core object.
 * @returns A Promise that resolves when the deletion is complete.
 */
export async function getalllisteners(url: string, core: CoreC) {
  const response: any = await fetch(`http://${url}/${core._core_id}/gl`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Specify the content type as JSON
      'authtok': core?._sessiontoken !== undefined ? core?._sessiontoken : '',
    }
  }).then(

    (data) => {
      return data.status === 200 ? data.json() : '';
    }
  ).catch((error: Error) => {
    console.log(error);
  })

  return response
}



/**
 * Makes an AJAX request using XMLHttpRequest.
 * @param {string} url - The URL to send the AJAX request to.
 * @param {Core} [core] - Optional parameter representing the core configuration for the request.
 * @returns {void}
 */
export function getRootDirectory(url: string, core: string, _sessiontok: string, _title: string): Promise<Root> {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `http://${url}/${core}/dir`, true);
    xhr.setRequestHeader('authtok', core !== undefined ? _sessiontok : '');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var responseData = JSON.parse(xhr.responseText);
          const rootdir: File[] = responseData['_files'] !== undefined && Array.isArray(responseData['_files'])
            ? responseData['_files'].map((fileData: any) => new File(fileData['_size'], fileData['_name'], fileData["_extension"]))
            : [];
          const rootdirectory: Root = new Root(
            `/${core}/${_title}/`,
            responseData['_core_id'],
            responseData['_filecount'],
            rootdir
          );
          //console.log(rootdirectory);
          resolve(rootdirectory); // Resolve the promise with the result
        } else {
          console.error('Request failed with status:', xhr.status);
          reject(new Error(`Request failed with status: ${xhr.status}`)); // Reject the promise with an error
        }
      }
    };
    xhr.send();
  });
}

/**
 * Set Configuration
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {any} dat  - Data.
 * @returns {status} - 200 or else
 */
export async function setconfigurations(url: string, core: CoreC, dat: any) {
  try {
    const apiUrl = `http://${url}/${core._core_id}/sconf`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      },
      body: JSON.stringify(dat)
    }).then(data => { return data.json() }).catch(error => console.log(error));

    return response;
  } catch (error) {
    console.error('Error:', error);
    return 500;
  }
}




/**
 * Manage the users Insert or delete
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} core - The Core object.
 * @param {any} dat  - Data.
 * @returns {status} - json or nothing
 */
export async function ManageUser(url: string, core: CoreC, dat: any, InsertOrDelete: boolean) {
  try {
    const apiUrl = InsertOrDelete ?  `http://${url}/${core._core_id}/usrmgr/1` : `http://${url}/${core._core_id}/usrmgr/0` ;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      },
      body: JSON.stringify(dat)
    }).then(data => { return data.json() }).catch(error => console.log(error));
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}


/**
 * Export to Dump
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {Core} CoreC - The Core object.
 * @param {instance} Instance - The Current isntance.
 * @returns {status} - json or nothing
 */
export async function ExportDumpToFile(url:string,instance:Instance,core:CoreC) {
  try {
    const apiUrl =  `http://${url}/${core._core_id}/${instance._instance_id}/exdump`
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authtok': core._sessiontoken,
      }
    }).then(data => { return data.status }).catch(error => console.log(error));
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Export to Dump
 *
 * @async
 * @function
 * @param {string} url - The URL.
 * @param {coreId} CoreC - The Core object.

 * @returns {status} - json or nothing
 */
export async function dumpTargets(url: string, core: CoreC){
  try {
    const apiUrl = `http://${url}/${core._core_id}/dmptargs`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'authtok': core._sessiontoken,
      }
    }).then(data => { return  data.json() }).catch(error => console.log(error));
    return response;
  } catch (error) {
    console.error('Error:', error);
  }

}


