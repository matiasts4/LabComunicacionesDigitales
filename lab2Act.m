clear; close all; clc;

% --- Parámetros de la señal ---
Nbits = 1e4;                % 10^4 bits 
bit_rate = 1;               % Tasa de bits (bps)
Tb = 1/bit_rate;            % Periodo de bit
f0 = bit_rate / 2;          % Frecuencia base (Nyquist)
alpha_vals = [0, 0.25, 0.75, 1]; % Valores de roll-off
SNR = 20;                   % Relación señal-ruido (dB)

% --- Configuración de muestreo ---
oversample_factor = 50;     % Muestras por símbolo (Tb)
Fs = oversample_factor / Tb;% Frecuencia de muestreo

% --- Generación de bits y codificación NRZ-L ---
bits = randi([0, 1], Nbits, 1);
data_nrz = 2*bits - 1;      % 0 -> -1, 1 -> +1

% --- Bucle para cada alpha ---
for alpha = alpha_vals
    fprintf('Procesando alpha = %.2f...\n', alpha);
    
    % --- Diseñar filtro de coseno alzado ---
    span = 10;              % Duración del filtro (símbolos)
    sps = oversample_factor;% Muestras por símbolo
    h_rc = rcosdesign(alpha, span, sps, 'normal'); 
    
    % --- Generar señal transmitida ---
    tx_upsampled = upsample(data_nrz, sps);
    tx_filtered = conv(tx_upsampled, h_rc, 'same');
    
    % --- Agregar ruido AWGN ---
    tx_noisy = awgn(tx_filtered, SNR, 'measured');
    
    % --- Diagrama de ojo ---
    samples_per_symbol = sps;
    offset = floor(length(h_rc)/2); 
    eyediagram(tx_noisy(offset:end-offset), 2*samples_per_symbol, 1/Fs);
    title(sprintf('Diagrama de Ojo con \\alpha = %.2f', alpha)); % Título modificado
end