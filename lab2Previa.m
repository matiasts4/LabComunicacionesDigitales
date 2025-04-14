% Parámetro básico
f0 = 1;                       % Ancho de banda de 6 dB (valor arbitrario)
alpha_vals = [0 0.25 0.75 1];   % Factores de roll-off a evaluar

% Vector de tiempo para la respuesta al impulso (solo t>=0)
t = linspace(0, 5, 1000);

% Crear figura que contendrá 2 subgráficas
figure;

%% Subgráfica 1: Respuesta al impulso h(t)
subplot(1,2,1);
hold on;  % Permite graficar múltiples curvas en la misma subgráfica

for i = 1:length(alpha_vals)
    alpha = alpha_vals(i);
    f_delta = alpha * f0;
    
    % Inicializar h(t)
    h = zeros(size(t));
    
    % Calcular h(t) según la ecuación (14)
    for k = 1:length(t)
        if t(k) == 0
            % Utilizamos el límite cuando t --> 0
            h(k) = 2 * f0;
        else
            h(k) = 2*f0 * ( sin(2*pi*f0*t(k))/(2*pi*f0*t(k)) ) * ( cos(2*pi*f_delta*t(k))/(1 - (4*f_delta*t(k))^2) );
        end
    end
    
    % Graficar la respuesta al impulso para el valor actual de alpha
    plot(t, h, 'LineWidth', 1.5);
end

title('Respuesta al impulso h(t) para t \geq 0');
xlabel('Tiempo t');
ylabel('h(t)');
grid on;
legend('\alpha = 0', '\alpha = 0.25', '\alpha = 0.75', '\alpha = 1');

%% Subgráfica 2: Respuesta en frecuencia H(f)
subplot(1,2,2);
hold on;  % Permite graficar múltiples curvas en la misma subgráfica

for i = 1:length(alpha_vals)
    alpha = alpha_vals(i);
    f_delta = alpha * f0;
    
    % Calcular el ancho de banda absoluto y el valor de f1
    B = f0 + f_delta;
    f1 = f0 - f_delta;
    
    % Definir el vector de frecuencia para el rango [-2B, 2B]
    f = linspace(-2*B, 2*B, 1000);
    H = zeros(size(f));
    
    % Calcular H(f) según la ecuación (10)
    for k = 1:length(f)
        absf = abs(f(k));
        if absf < f1
            H(k) = 1;
        elseif (absf >= f1) && (absf <= B)
            % Prevenir división por cero cuando alpha = 0 (f_delta = 0)
            if f_delta ~= 0
                H(k) = 0.5 * (1 + cos(pi * (absf - f1) / (2*f_delta)));
            else
                H(k) = 1;
            end
        else
            H(k) = 0;
        end
    end
    
    % Graficar la respuesta en frecuencia para el valor actual de alpha
    plot(f, H, 'LineWidth', 1.5);
end

title('Respuesta en frecuencia H(f)');
xlabel('Frecuencia f');
ylabel('H(f)');
grid on;
legend('\alpha = 0', '\alpha = 0.25', '\alpha = 0.75', '\alpha = 1');
