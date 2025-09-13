export default class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private onMessageCallback: ((data: any) => void) | null = null;
  private onOpenCallback: (() => void) | null = null;
  private onCloseCallback: (() => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    try {
      console.log(`Tentative de connexion à ${this.url}`);
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log("WebSocket connecté avec succès");
        if (this.onOpenCallback) this.onOpenCallback();
      };

      // this.socket.onmessage = (event) => {
      //   console.log("Message reçu:", event.data);
      //   if (this.onMessageCallback) this.onMessageCallback(event.data);
      // };
      this.socket.onmessage = (event) => {
        console.log("📩 [WebSocketService] Message brut reçu:", event.data);
        if (this.onMessageCallback) {
          console.log("➡️ [WebSocketService] Transmission du message au callback");
          this.onMessageCallback(event.data);
        }
      };
      

      this.socket.onclose = (event) => {
        console.log(
          "WebSocket déconnecté. Code:",
          event.code,
          "Raison:",
          event.reason
        );

        if (event.code == 4001 || event.reason.includes("auth")) {
          console.error(
            "Erreur d'authentification WebSocket. Reconnexion avec un nouveau token..."
          );
        }

        if (this.onCloseCallback) this.onCloseCallback();
      };

      this.socket.onerror = (error) => {
        console.error("Erreur WebSocket:", error);
      };
    } catch (error) {
      console.error("Erreur lors de la connexion au WebSocket:", error);
      console.error("URL de connexion:", this.url);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessage(data: string) {
    if (this.socket && this.socket.readyState == WebSocket.OPEN) {
      console.log("Message envoyé:", data);
      this.socket.send(data);
    } else {
      console.error("WebSocket non connecté. Impossible d'envoyer le message.");
    }
  }

  setOnMessageCallback(callback: (data: any) => void) {
    this.onMessageCallback = callback;
  }

  setOnOpenCallback(callback: () => void) {
    this.onOpenCallback = callback;
  }

  setOnCloseCallback(callback: () => void) {
    this.onCloseCallback = callback;
  }
}
