FROM ubuntu:latest

# Copy the script into the container
COPY init.sh /init.sh

# Make sure it is executable
RUN chmod +x /init.sh

# Default command
CMD ["/bin/bash", "/init.sh"]
