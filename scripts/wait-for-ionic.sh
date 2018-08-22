# This script will tail the content of 'nohup.out' until a line
# containing the text 'Development server running!' is found.
# It will then kill the tail allowing other commands to run.
tail -f -n0 ./nohup.out | while read LOGLINE
do
    if [[ "${LOGLINE}" == *"Development server running!"* ]]; then
        pkill -P $$ tail
    fi
done
