const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();                  
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Collection name and DynamoDB table
const COLLECTION_ID = 'gen-auth-face-collection'; 
const DYNAMO_TABLE = 'gen-auth-faceprints'; 

exports.handler = async (event) => {
  try {
    // S3 event details
    const s3Records = event.Records;

    console.log(s3Records);

    // Loop through each record (in case of multiple image uploads)
    for (const record of s3Records) {
      const bucketName = record.s3.bucket.name;
      const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      console.log({bucketName, objectKey})

      // Get the image from S3
      const imageData = await getImageFromS3(bucketName, objectKey);

      // Index the face using Rekognition and generate face metadata
      const faceMetadata = await indexFace(imageData, objectKey);

      // Store face metadata in DynamoDB (file name, face ID, and other attributes)
      await storeFaceMetadataInDynamoDB(objectKey, faceMetadata);
    }

    return {
      statusCode: 200,
      body: JSON.stringify('Image processed and face indexed successfully'),
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Error processing image'),
    };
  }
};

// Function to get image from S3
const getImageFromS3 = async (bucket, key) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  const image = await s3.getObject(params).promise();
  return image.Body; // This returns the binary image data
};

// Function to index the face using Rekognition's `indexFaces`
const indexFace = async (imageData, objectKey) => {
  const params = {
    CollectionId: COLLECTION_ID, // The collection where faces are stored
    Image: {
      Bytes: imageData,
    },
    ExternalImageId: objectKey, // Use the S3 object key as an identifier for the image
    DetectionAttributes: ['ALL'] // Optionally detect all attributes
  };

  console.log({params});

  const result = await rekognition.indexFaces(params).promise();
  
  // Get the first face in the response (you can extend this to handle multiple faces)
  if (result.FaceRecords && result.FaceRecords.length > 0) {
    const faceRecord = result.FaceRecords[0];
    const faceId = faceRecord.Face.FaceId;
    const faceDetails = faceRecord.Face;
    
    return {
      faceId,
      faceDetails
    };
  }

  return 'No face detected';
};

// Function to store face metadata in DynamoDB
const storeFaceMetadataInDynamoDB = async (fileName, faceMetadata) => {
  console.log({faceMetadata});
  console.log({fileName});
  const params = {
    TableName: DYNAMO_TABLE,
    Item: {
      faceprints: faceMetadata.faceId, // Store the face ID from Rekognition
      user: JSON.stringify(faceMetadata.faceDetails) // Store face details as a string
    },
  };
  console.log({params});

  await dynamoDB.put(params).promise();
};
