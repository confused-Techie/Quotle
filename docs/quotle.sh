#!/bin/bash

SOURCE_DIR=""
SOURCE_FILE=""

TIME_STAMP[0]=""
TIME_STOP[0]=""

TIME_STAMP[1]=""
TIME_STOP[1]=""

TIME_STAMP[2]=""
TIME_STOP[2]=""

TIME_STAMP[3]=""
TIME_STOP[3]=""

TIME_STAMP[4]=""
TIME_STOP[4]=""

TIME_STAMP[5]=""
TIME_STOP[5]=""

i=0
len=${#TIME_STAMP[@]}

echo "${SOURCE_DIR}/${SOURCE_FILE}"
while [ $i -lt $len ];
do
  echo "${TIME_STAMP[$i]} ${TIME_STOP[$i]}"
  ffmpeg -ss "${TIME_STAMP[$i]}" -t "${TIME_STOP[$i]}" -i "$SOURCE_DIR"/"$SOURCE_FILE" audio$i.mp3
  echo "$i: ${TIME_STAMP[$i]} [${TIME_STOP[$i]}]" >> meta.txt
  let i++
done
