import sys
import numpy as np
import torch

SAMPLING_RATE = 8000
BYTES_PER_SAMPLE = 2  # 16-bit PCM

torch.set_num_threads(1)

sys.stdout.write("The below error is okay")
sys.stdout.flush()

model, utils = torch.hub.load(repo_or_dir='snakers4/silero-vad:master',
                              model='silero_vad',
                              force_reload=True,
                              onnx=False)

(get_speech_timestamps,
 save_audio,
 read_audio,
 VADIterator,
 collect_chunks) = utils

vad_iterator = VADIterator(model)

speech_probs = []
window_size_samples = 1024
buffer = torch.Tensor([])

MuLawDecompressTable = np.array([
    -32124, -31100, -30076, -29052, -28028, -27004, -25980, -24956,
    -23932, -22908, -21884, -20860, -19836, -18812, -17788, -16764,
    -15996, -15484, -14972, -14460, -13948, -13436, -12924, -12412,
    -11900, -11388, -10876, -10364,  -9852,  -9340,  -8828,  -8316,
     -7932,  -7676,  -7420,  -7164,  -6908,  -6652,  -6396,  -6140,
     -5884,  -5628,  -5372,  -5116,  -4860,  -4604,  -4348,  -4092,
     -3900,  -3772,  -3644,  -3516,  -3388,  -3260,  -3132,  -3004,
     -2876,  -2748,  -2620,  -2492,  -2364,  -2236,  -2108,  -1980,
     -1884,  -1820,  -1756,  -1692,  -1628,  -1564,  -1500,  -1436,
     -1372,  -1308,  -1244,  -1180,  -1116,  -1052,   -988,   -924,
      -876,   -844,   -812,   -780,   -748,   -716,   -684,   -652,
      -620,   -588,   -556,   -524,   -492,   -460,   -428,   -396,
      -372,   -356,   -340,   -324,   -308,   -292,   -276,   -260,
      -244,   -228,   -212,   -196,   -180,   -164,   -148,   -132,
      -120,   -112,   -104,    -96,    -88,    -80,    -72,    -64,
       -56,    -48,    -40,    -32,    -24,    -16,     -8,      0,
    32124, 31100, 30076, 29052, 28028, 27004, 25980, 24956,
    23932, 22908, 21884, 20860, 19836, 18812, 17788, 16764,
    15996, 15484, 14972, 14460, 13948, 13436, 12924, 12412,
    11900, 11388, 10876, 10364,  9852,  9340,  8828,  8316,
     7932,  7676,  7420,  7164,  6908,  6652,  6396,  6140,
     5884,  5628,  5372,  5116,  4860,  4604,  4348,  4092,
     3900,  3772,  3644,  3516,  3388,  3260,  3132,  3004,
     2876,  2748,  2620,  2492,  2364,  2236,  2108,  1980,
     1884,  1820,  1756,  1692,  1628,  1564,  1500,  1436,
     1372,  1308,  1244,  1180,  1116,  1052,   988,   924,
      876,   844,   812,   780,   748,   716,   684,   652,
      620,   588,   556,   524,   492,   460,   428,   396,
      372,   356,   340,   324,   308,   292,   276,   260,
      244,   228,   212,   196,   180,   164,   148,   132,
      120,   112,   104,    96,    88,    80,    72,    64,
       56,    48,    40,    32,    24,    16,     8,      0
])

def mulaw2lin(mulaw):
    """Convert 8-bit mu-law to linear 16-bit PCM."""
    return MuLawDecompressTable[mulaw]

def int2float(sound):
    abs_max = np.abs(sound).max()
    sound = sound.astype('float32')
    if abs_max > 0:
        sound *= 1/32768
    sound = sound.squeeze()  # depends on the use case
    return sound

while True:
    audio_chunk = sys.stdin.buffer.read(window_size_samples)
    
    if len(audio_chunk) == 0:
        break  # End of input

    # Convert the mu-law encoded audio to 16-bit PCM
    audio_data = np.frombuffer(audio_chunk, dtype=np.uint8)
    audio_data_pcm = mulaw2lin(audio_data)
    
    # Convert to float32
    audio_float32 = int2float(audio_data_pcm)
    
    # get the confidences and add them to the list to plot them later
    new_confidence = model(torch.from_numpy(audio_float32), 8000).item()
    sys.stdout.write(f"{new_confidence}")
    sys.stdout.flush()
