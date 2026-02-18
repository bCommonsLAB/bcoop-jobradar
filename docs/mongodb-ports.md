# MongoDB Verbindungs-Ports

## Ports für MongoDB Atlas (Cloud)

Bei MongoDB Atlas (Cloud-Service) sind **keine Ports zu öffnen** erforderlich, da:

1. **Ausgehende Verbindungen**: Die Anwendung stellt eine **ausgehende Verbindung** zu MongoDB Atlas her
2. **Keine eingehenden Ports**: MongoDB Atlas akzeptiert Verbindungen von überall im Internet
3. **TLS-Verschlüsselung**: Alle Verbindungen sind über TLS verschlüsselt

## Ports für lokale MongoDB-Installation

Falls Sie eine **lokale MongoDB-Installation** verwenden würden:

- **Port 27017**: Standard MongoDB Port (TCP)
- **Port 27018**: MongoDB Shard Port (falls verwendet)
- **Port 27019**: MongoDB Config Server Port (falls verwendet)

## Firewall-Einstellungen

### Für MongoDB Atlas (empfohlen):
- **Keine Firewall-Regeln erforderlich** für ausgehende Verbindungen
- Stellen Sie sicher, dass **ausgehende HTTPS-Verbindungen** (Port 443) erlaubt sind
- Stellen Sie sicher, dass **DNS-Abfragen** (Port 53) erlaubt sind

### Für lokale MongoDB:
- Öffnen Sie Port 27017 für eingehende Verbindungen (nur wenn MongoDB von außen erreichbar sein soll)
- Für lokale Entwicklung: Keine Firewall-Regeln erforderlich

## Aktuelle Konfiguration

Ihre `.env`-Datei verwendet MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://...
```

Daher sind **keine Ports zu öffnen** erforderlich. Die Verbindung funktioniert über:
- DNS-Auflösung (Port 53 UDP/TCP)
- TLS-verschlüsselte Verbindung zu MongoDB Atlas Servern

## Troubleshooting

Falls Verbindungsprobleme auftreten:

1. **DNS-Auflösung prüfen**: 
   ```powershell
   nslookup bcommonslab.kh9co.mongodb.net
   ```

2. **Ausgehende Verbindungen testen**:
   ```powershell
   Test-NetConnection -ComputerName bcommonslab.kh9co.mongodb.net -Port 27017
   ```

3. **Firewall-Logs prüfen**: Überprüfen Sie, ob ausgehende Verbindungen blockiert werden
