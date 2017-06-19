
> 下载Node
```
https://nodejs.org/dist/v6.11.0/node-v6.11.0.pkg
```

> 安装brew
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
> 安装opencv
```
brew tap homebrew/science
brew install opencv
brew install opencv3; brew link --force opencv3
brew unlink opencv && brew link --overwrite opencv
```

> 启动服务
```
cd 下载目录/face-detection/src
node index.js
```

> 浏览器打开：`http://localhost:3001/`
