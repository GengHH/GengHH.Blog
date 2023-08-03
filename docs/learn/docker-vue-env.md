## 练习使用 docker 容器化开发部署 Vue 项目

##### 最近几年，docker 可以说是火的不得了，作为前端我们也需要去了解它，知道它解决了什么问题，以及对我们来说有什么可用之处。

今天我将会使用 Vue CLI 创建一个项目，使用 Docker，Docker Compose 容器化方式来开发和部署一个 Vue 项目。

我们将会实现：

1.开发环境支持代码热重载

2.配置生产环境镜像多重构建

我所使用的版本

Docker：20.10.5

Vue-CLI：4.5.9

Node：v12.6.0

### 1.本地（宿主机）项目创建

```
全局安装Vue CLI：

npm install -g @vue/cli
创建一个全新Vue项目, （要选vue-router，history模式，后面有用）

vue create my-app
cd my-app
```

### 2.开发环境

#### 2.1 Docker

在项目根目录中创建 Dockerfile 文件（内容如下：）

```
# 基础 image
FROM node:12.6.0-alpine

# 设置项目目录
WORKDIR /app

# 安装项目依赖
COPY package.json .
RUN npm install

# 运行
CMD ["npm", "run", "serve"]
创建.dockerignore文件

node_modules
.git
.gitignore
构建Docker image

docker build -t my-app:dev .
运行

docker run -v ${PWD}:/app -v /app/node_modules -p 8081:8080 --rm my-app:dev
```

Tips:

1.docker run 创建一个基于 my-app:dev 镜像的容器并运行

2.`-v ${PWD}:/app` 挂载当前项目目录到容器内的/app 文件夹

**_windows 用户可能不支持${PWD}，请使用绝对路径代替_**

3.`-v /app/node_modules` 这个必要的，因为我们要用容器内的 node_modules 依赖，前面我们我们已经将项目目录`${PWD}:/app`挂载，所以我们要创建这个匿名卷，防止使用项目目录的 node_modules。

4.`-p 8081:8080` 将容器内的 8080 映射到当前机器的 8081

5.`--rm` 容器将在退出后删除

然后我们访问 http://localhost:8081/，尝试修改 src/App.vue 中的代码。浏览器将会自动刷新，触发热重载。

#### 2.2 Docker Compose

在根目录创建 docker-compose.yaml 文件

```
version: '3.7'

services:

  my-app:
    container_name: my-app
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - '.:/app'
      - '/app/node_modules'
    ports:
      - '8081:8080'
然后构建镜像并启动容器

docker-compose up -d --build
```

同样打开浏览器访问 http://localhost:8081/，尝试修改 src/App.vue 中的代码。浏览器将会自动刷新，触发热重载。

停止 docker-compose

```
docker-compose stop

```

### 3.生产环境

#### 3.1 Docker

在项目根目录创建 Dockerfile-prod 文件（内容如下：）

```
# 构建容器
FROM node:12.6.0-alpine as build
WORKDIR /app

COPY package.json .
RUN npm install
COPY . /app
RUN npm run build

# 生产容器
FROM nginx:1.16.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

使用生产环境的 Dockerfile，来构建 image

```
docker build -f Dockerfile-prod -t my-app:prod .
```

运行容器

```
docker run -it -p 80:80 --rm my-app:prod
```

然后访问 http://localhost/ 或者 http://你的宿主机 ip

#### 3.2 Docker Compose

在根目录创建 docker-compose-prod.yaml 文件（内容如下：）

```
version: '3.7'

services:

  my-app-prod:
    container_name: my-app-prod
    build:
      context: .
      dockerfile: Dockerfile-prod
    ports:
      - '80:80'
```

运行 docker-compose

```
docker-compose -f docker-compose-prod.yaml up -d --build
```

停止

```
docker-compose -f docker-compose-prod.yaml stop
```

然后访问 http://localhost/ 或者 http://你的宿主机 ip

### Vue Router 的 history 模式 Nginx 配置

前面我们切换路由，并刷新页面发现是 404，我们需要修改对应 nginx 的配置

创建 nginx 配置文件夹

```
└── nginx
    └── nginx.conf
```

nginx.conf

```
server {

  listen 80;

  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  error_page 500 502 503 504 /50x.html;

  location = /50x.html {
    root /usr/share/nginx/html;
  }

}
```

我们需要增加配置新的 nginx 配置文件

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
新的 Dockerfile-prod 文件

```
# 构建容器

FROM node:12.6.0-alpine as build
WORKDIR /app

COPY package.json .
RUN npm install
COPY . /app
RUN npm run build

# 生产容器

FROM nginx:1.16.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

```

重新构建 image，运行容器或者 docker-compose。
