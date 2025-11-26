import wave
import struct
import math
import requests

# generate 1s 16kHz mono 16-bit sine
samplerate = 16000
duration = 1.0
freq = 440.0
nframes = int(samplerate * duration)
with wave.open('test.wav','w') as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(samplerate)
    for i in range(nframes):
        val = int(32767.0 * 0.5 * math.sin(2.0*math.pi*freq*(i/samplerate)))
        wf.writeframes(struct.pack('<h', val))

files = {'audio': open('test.wav','rb')}
resp = requests.post('http://127.0.0.1:5000/upload_audio', files=files)
print('STATUS', resp.status_code)
try:
    print(resp.json())
except Exception as e:
    print(resp.text)
