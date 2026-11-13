set -e
cd "$(dirname "$0")/build"
nice ffmpeg -v error -y -i voice.wav -i music.wav -filter_complex "[0]aformat=channel_layouts=stereo,asplit[v][sc];[1]lowpass=f=4500,highpass=f=60,volume=-21dB[m];[m][sc]sidechaincompress=threshold=0.015:ratio=8:attack=25:release=500[md];[v][md]amix=inputs=2:normalize=0:duration=first[o]" -map "[o]" -ar 48000 mix.wav
J=$(nice ffmpeg -hide_banner -i mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
MI=$(echo "$J"|python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
nice ffmpeg -v error -y -i mix.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:$MI:linear=true" -ar 48000 final_audio.wav
nice ffmpeg -hide_banner -i final_audio.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):"
