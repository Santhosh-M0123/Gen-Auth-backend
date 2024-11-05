const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition(); // For face recognition
// Create a collection (only run this once or ensure it's created separately)
const createCollection = async (collectionId) => {
    try {
        console.log('revoked')
    const params = {
      CollectionId: collectionId
    };
    console.log(params)
    const resp = await rekognition.createCollection(params).promise();
    console.log({resp});
    return resp;
    } catch (error) {
        console.log(error)
    }
};

//created collection info

const info = {
    "StatusCode":200,
    "CollectionArn":"aws:rekognition:us-east-1:314146335269:collection/gen-auth-face-collection",
    "FaceModelVersion":"7.0"
}

module.exports = createCollection;
