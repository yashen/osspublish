# osspublish
publish software use aliyun oss

## Usage

    osspublish init <softwarename>

    osspublish storage <region> <accessKeyId> <accessKeySecret> <bucket> <root>

    osspublish upgrade <versionName> <localfilepath>

    osspublish upload


Then,you can access url http://&lt;bucket&gt;.&lt;region&gt;.aliyuncs.com/&lt;root&gt;/&lt;softwarename&gt;/download.json

    {"name":"softwarename","version":"1.0.1","filename":"1.0.1/test.apk"}