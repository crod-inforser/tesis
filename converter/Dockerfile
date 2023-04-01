# Use an official Alpine image as a parent image
FROM alpine:3.15

# Install necessary packages and libraries 
RUN apk add --no-cache --virtual .build-deps build-base cmake git boost-dev zlib-dev libstdc++ zlib autoconf automake libtool g++

# Clone, build and install librcsc
RUN git clone https://github.com/helios-base/librcsc.git /usr/local/lib/librcsc
RUN cd /usr/local/lib/librcsc && sh bootstrap && sh configure  --disable-unit-test && make

# Create a symbolic link for rcg2txt
ENV PATH="/usr/local/lib/librcsc/src/:${PATH}"
# Cleanup
