interface ApiResponse {
    id: number;
    title: string;
    body: string;
}

class RandomTextFetcher {
    private textoElement: HTMLParagraphElement;
    private numeroElement: HTMLParagraphElement;
    private botonElement: HTMLButtonElement;
    
    // Usando JSONPlaceholder como API de prueba
    private apiUrl: string = 'https://jsonplaceholder.typicode.com/posts';
    
    private textos: ApiResponse[] = [];

    constructor() {
        this.textoElement = document.getElementById('text-advice') as HTMLParagraphElement;
        this.numeroElement = document.getElementById('number') as HTMLParagraphElement;
        this.botonElement = document.getElementById('button') as HTMLButtonElement;
        
        this.botonElement.addEventListener('click', () => this.mostrarTextoAleatorio());
        this.cargarDatos();
    }

    private async cargarDatos(): Promise<void> {
        try {
            const response = await fetch(this.apiUrl);
            
            // Verificar el tipo de contenido
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`La API no devolvió JSON. Respuesta: ${text.substring(0, 100)}...`);
            }
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            this.textos = await response.json() as ApiResponse[];
            this.mostrarTextoAleatorio();
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            this.textoElement.textContent = 'Error al cargar los textos. Verifica la consola.';
            this.numeroElement.textContent = 'Error';
        }
    }

    private mostrarTextoAleatorio(): void {
        if (this.textos.length === 0) {
            this.textoElement.textContent = 'No hay textos disponibles';
            this.numeroElement.textContent = '-';
            return;
        }
        
        const indiceAleatorio = Math.floor(Math.random() * this.textos.length);
        const textoSeleccionado = this.textos[indiceAleatorio];
        
        this.textoElement.textContent = textoSeleccionado.title;
        this.numeroElement.textContent = `# ${textoSeleccionado.id}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RandomTextFetcher();
});