export const asyncHandler = (fn) => async function (req, res, next)
{
    try {
        return await fn(req, res);
    } catch (error) {
        next(error);
    }
};

export const getSecondsFromNow = (seconds) => {
    const currentTime = new Date();
    currentTime.setSeconds(currentTime.getSeconds() + seconds);
    return currentTime.getTime() / 1000;

};




//in the code below, we create a permissions object

export const permissions = {
    events: {
        create: ["admin", "super admin"],
        read: ["user", "admin", "super admin"],
        update: ["admin", "super admin"],
        delete: ["admin", "super admin"],
    },

    user: {
        create: ["admin", "super admin"],
        read: ["admin", "super admin"],
        update: ["admin", "super admin"],
        delete: ["admin", "super admin"],
    },

    role: {
        create: ["super admin"],
        read: ["super admin"],
        update: ["super admin"],
        delete: ["supeer admin"],
    },
    auth: {
    read: ["admin", "super admin"], 
    create: [],
    update: [],
    delete: [],
  }
};

export function getOperationType(method)
{
    let operation;
     switch (method)
        {
            case "post":
                operation = "create";
                break;
            case "get":
                operation = "read";
                break;
            case "put":
                operation = "update";
                break;
            case "delete":
                operation = "delete";
                break;
            default:
                operation = "read";
        }
        return operation;
}

export async function aggregateResults(model, payload)
//this takes in two arguments MODEL: a mongoose model and PAYLOAD: this 
//is the filter criteria-an object that tells .find() what kind of documents to search for.
{
    //create an aggregation pipeline and return the results
    return await model.find(payload);
    // youre asking the database to find all documents that match this payload
    // the result is an array of documents that satisfy the conditions in PAAYLOAD
}

