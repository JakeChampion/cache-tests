FROM ubuntu:devel
LABEL maintainer="Mark Nottingham <mnot@mnot.net>"


# package installs

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    nodejs npm git openssh-client telnet \
    squid \
    nginx \
    apache2 \
    varnish \
    golang \
    haproxy \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean


# squid

COPY squid/squid.conf /etc/squid/conf.d/cache-test.conf

ENV SQUID_CACHE_DIR=/var/spool/squid
ENV SQUID_LOG_DIR=/var/log/squid
ENV SQUID_USER=proxy
EXPOSE 8001


# nginx

RUN mkdir /var/cache/nginx
COPY nginx/nginx.conf /etc/nginx/sites-enabled/cache-test.conf
EXPOSE 8002


# trafficserver

COPY trafficserver/ip_allow.config /etc/trafficserver/ip_allow.config
COPY trafficserver/records.config /etc/trafficserver/records.config
COPY trafficserver/remap.config /etc/trafficserver/remap.config

ENV TS_CACHE_DIR=/var/run/trafficserver
ENV TS_LOG_DIR=/var/log/trafficserver
ENV TS_USER=trafficserver
EXPOSE 8003


# apache

RUN a2enmod cache_socache
RUN a2enmod cache_disk
RUN a2enmod proxy_http

COPY apache/ports.conf /etc/apache2/ports.conf
COPY apache/apache.conf /etc/apache2/sites-enabled/cache-test.conf
EXPOSE 8004


# varnish

EXPOSE 8005


# caddy

RUN go install github.com/caddyserver/xcaddy/cmd/xcaddy@latest
RUN ~/go/bin/xcaddy build --with github.com/caddyserver/cache-handler
COPY caddy/Caddyfile /etc/caddy/Caddyfile
EXPOSE 8006


# haproxy

COPY haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
EXPOSE 8007


# Set environment variables to avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    libbz2-dev \
    wget \
    autoconf \
    automake \
    libtool \
    pkg-config \
    build-essential \
    ca-certificates \
    curl \
    git \
    cmake \
    clang-format-14 \
    libstdc++-11-dev \
    libjsoncpp-dev \
    libleveldb-dev \
    libre2-dev \
    libssl-dev \
    zlib1g-dev \
    libpcre3-dev \
    libcap-dev \
    libhwloc-dev \
    libbrotli-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory to /src
WORKDIR /src

# Download Apache Traffic Server source code (version 9.2.9)
RUN wget https://downloads.apache.org/trafficserver/trafficserver-9.2.9.tar.bz2

# Extract the downloaded tarball
RUN tar -xvjf trafficserver-9.2.9.tar.bz2

# Set the working directory to the Traffic Server source code
WORKDIR /src/trafficserver-9.2.9

# Configure, make, and install Traffic Server
RUN ./configure && make && make install



# setup

COPY setup.sh /sbin/setup.sh
RUN chmod 755 /sbin/setup.sh
RUN /sbin/setup.sh

# serve

COPY serve.sh /sbin/serve.sh
RUN chmod 755 /sbin/serve.sh


# entrypoint

COPY entrypoint.sh /sbin/entrypoint.sh
RUN chmod 755 /sbin/entrypoint.sh
ENTRYPOINT ["/sbin/entrypoint.sh"]
CMD []
