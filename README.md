# osspublish
publish software use aliyun oss

## Usage

    //This will create a config file osspublish.json on current folder
    osspublish init <softwarename> 

    //This will create a config file .ossstorage.json
    //Save software's storage place and authentication config,don't save real accessKeyId and accessKeySecret in here
    osspublish storage <region> <accessKeyId> <accessKeySecret> <bucket> <root>

    //Set uploadfiles's version and path
    osspublish upgrade <versionName> <localfilepath>

    //Upload file
    //If accessKeyId and accessKeySecret is right,use
    osspublish upload
    //else
    osspublish uplooad -k accessKeyId -s accessKeySecret


Then,you can access url http://&lt;bucket&gt;.&lt;region&gt;.aliyuncs.com/&lt;root&gt;/&lt;softwarename&gt;/download.json

    {"name":"softwarename","version":"1.0.1","filename":"1.0.1/test.apk"}