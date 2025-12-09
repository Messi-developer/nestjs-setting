FROM node:20

# APP ENV 설정
ENV TZ=Asia/Seoul \
    UV_THREADPOOL_SIZE=15 \
    NODE_ENV=development \
    APP_PORT=9015

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Update npm
RUN npm install -g npm@10.7.0

# oracle instant client 설치
RUN apt update && \
    apt install -y alien libaio1 wget && \
    wget -q https://download.oracle.com/otn_software/linux/instantclient/214000/oracle-instantclient-basic-21.4.0.0.0-1.x86_64.rpm && \
    alien -i oracle-instantclient-basic-21.4.0.0.0-1.x86_64.rpm && \
    rm oracle-instantclient-basic-21.4.0.0.0-1.x86_64.rpm && \
    apt autoremove -y wget && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# oracle instant client 설치
# RUN apt install -y alien libaio1 \
#     && wget https://download.oracle.com/otn_software/linux/instantclient/214000/oracle-instantclient-basic-21.4.0.0.0-1.x86_64.rpm \
#     && alien -i oracle-instantclient-basic-21.4.0.0.0-1.x86_64.rpm \
#     && rm oracle-instantclient-basic-21.4.0.0.0-1.x86_64.rpm

# Clear cache
# RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Working Directory 설정
WORKDIR /data/new_portal_int_api_bill

# 앱 소스 copy
COPY ./src /data/new_portal_int_api_bill
COPY ./package.json /data/new_portal_int_api_bill
COPY ./tsconfig.json /data/new_portal_int_api_bill

# DotEnv 설정 복사
# RUN mkdir -p "core"
# COPY ./core /data/ai-partner-bang/core

RUN chown -R node:node .

USER node

RUN npm install --legacy-peer-deps && npm cache clean --force
RUN npm run build

EXPOSE  9015

CMD npm run dev
