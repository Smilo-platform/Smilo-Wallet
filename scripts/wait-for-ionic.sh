# This script will tail the content of 'nohup.out' until a line
# containing the text 'dev server running' is found.
# It will then kill the tail allowing other commands to run.
tail -f ./nohup.out | while read LOGLINE
do
    if [[ "${LOGLINE}" == *"dev server running"* ]]; then
        echo "Started!"
        pkill -P $$ tail
    fi
done