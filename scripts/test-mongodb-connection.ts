/**
 * Test-Script für MongoDB-Verbindung
 * 
 * Dieses Script testet die MongoDB-Verbindung und gibt detaillierte Informationen aus.
 */

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

// Lade .env-Datei
dotenv.config()

async function testConnection() {
  const uri = process.env.MONGODB_URI
  const databaseName = process.env.MONGODB_DATABASE_NAME
  const collectionName = process.env.MONGODB_COLLECTION_NAME

  console.log('=== MongoDB Verbindungstest ===\n')
  console.log('MONGODB_URI:', uri ? `${uri.substring(0, 30)}...` : 'NICHT GEFUNDEN')
  console.log('MONGODB_DATABASE_NAME:', databaseName || 'NICHT GEFUNDEN')
  console.log('MONGODB_COLLECTION_NAME:', collectionName || 'NICHT GEFUNDEN')
  console.log('')

  if (!uri || !databaseName || !collectionName) {
    console.error('❌ Fehlende Umgebungsvariablen!')
    process.exit(1)
  }

  let client: MongoClient | null = null

  try {
    console.log('🔄 Versuche Verbindung zu MongoDB...')
    
    // Verbindungsoptionen mit Timeout
    const clientOptions = {
      serverSelectionTimeoutMS: 10000, // 10 Sekunden Timeout
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }

    client = new MongoClient(uri, clientOptions)
    
    console.log('🔄 Verbinde...')
    await client.connect()
    
    console.log('✅ Verbindung erfolgreich!')
    
    // Teste Datenbank-Zugriff
    console.log('\n🔄 Teste Datenbank-Zugriff...')
    const db = client.db(databaseName)
    const adminDb = client.db().admin()
    
    // Liste alle Datenbanken auf
    const dbs = await adminDb.listDatabases()
    console.log('📊 Verfügbare Datenbanken:')
    dbs.databases.forEach(db => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`)
    })
    
    // Teste Collection-Zugriff
    console.log(`\n🔄 Teste Collection-Zugriff: ${collectionName}...`)
    const collection = db.collection(collectionName)
    const count = await collection.countDocuments()
    console.log(`✅ Collection gefunden! Anzahl Dokumente: ${count}`)
    
    // Zeige erste 3 Dokumente
    if (count > 0) {
      console.log('\n📄 Erste 3 Dokumente:')
      const docs = await collection.find({}).limit(3).toArray()
      docs.forEach((doc, index) => {
        console.log(`\n  Dokument ${index + 1}:`)
        console.log(`    _id: ${doc._id}`)
        console.log(`    title: ${doc.title || 'N/A'}`)
        console.log(`    company: ${doc.company || 'N/A'}`)
      })
    } else {
      console.log('⚠️  Collection ist leer.')
    }
    
    console.log('\n✅ Alle Tests erfolgreich!')
    
  } catch (error) {
    console.error('\n❌ Fehler beim Verbindungstest:')
    console.error('Fehlertyp:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('Fehlermeldung:', error instanceof Error ? error.message : String(error))
    
    if (error instanceof Error && error.stack) {
      console.error('\nStack Trace:')
      console.error(error.stack)
    }
    
    // Zusätzliche Diagnose-Informationen
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
        console.error('\n💡 Diagnose: DNS-Auflösung fehlgeschlagen')
        console.error('   - Der MongoDB-Hostname kann nicht aufgelöst werden')
        console.error('   - Mögliche Ursachen:')
        console.error('     1. Keine Internetverbindung')
        console.error('     2. DNS-Server-Problem')
        console.error('     3. Firewall blockiert DNS-Anfragen')
        console.error('     4. MongoDB-Cluster existiert nicht mehr oder wurde umbenannt')
      } else if (error.message.includes('authentication')) {
        console.error('\n💡 Diagnose: Authentifizierungsfehler')
        console.error('   - Benutzername oder Passwort falsch')
      } else if (error.message.includes('timeout')) {
        console.error('\n💡 Diagnose: Verbindungs-Timeout')
        console.error('   - MongoDB-Server antwortet nicht')
      }
    }
    
    process.exit(1)
  } finally {
    if (client) {
      console.log('\n🔄 Schließe Verbindung...')
      await client.close()
      console.log('✅ Verbindung geschlossen.')
    }
  }
}

testConnection().catch(console.error)
