#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::sync::{Arc, Mutex};
use tauri::{
  Manager, State,
};

use sacn::source::SacnSource;
use sacn::packet::ACN_SDT_MULTICAST_PORT;
use std::net::{IpAddr, SocketAddr};


static UNIVERSE_1: u16 = 1;
static UNIVERSE_2: u16 = 2;
static UNIVERSE_3: u16 = 3;
static SYNC_UNI: Option<u16> = None;             // Don't want the packet to be delayed on the receiver awaiting synchronisation.
static PRIORITY: u8 = 10;                       // The priority for the sending data, must be 1-200 inclusive,  None means use default.
static DST_IP: Option<SocketAddr> = None;        // Sending the data using IP multicast so don't have a destination IP.


struct MyState {
  src: Arc<Mutex<SacnSource>>
}

#[tauri::command]
fn send_sacn(data: Vec<u8>, state: State<'_, MyState>) {
  println!("Sending data: {:?}", data);
  // let data: Vec<u8> = vec![0, 0, 0, 0, 255, 255, 128, 128]; // Some arbitrary data, must have length <= 513 (including start-code).
  let mut src = state.src.lock().unwrap();
  src.send(&[UNIVERSE_1], &data, Some(PRIORITY), DST_IP, SYNC_UNI).unwrap(); // Actually send the data
  src.send(&[UNIVERSE_2], &data, Some(PRIORITY), DST_IP, SYNC_UNI).unwrap(); // Actually send the data
  src.send(&[UNIVERSE_3], &data, Some(PRIORITY), DST_IP, SYNC_UNI).unwrap(); // Actually send the data
}

fn main() {

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![send_sacn])
    .setup(|app_handle| {
      // setup plugin specific state here
      let local_addr: SocketAddr = SocketAddr::new(IpAddr::V4("0.0.0.0".parse().unwrap()), ACN_SDT_MULTICAST_PORT + 1);
      let mut src =  SacnSource::with_ip("Wolbodo Lights", local_addr).unwrap();
      src.register_universe(UNIVERSE_1).unwrap(); // Register with the source that will be sending on the given universe.
      src.register_universe(UNIVERSE_2).unwrap(); // Register with the source that will be sending on the given universe.
      src.register_universe(UNIVERSE_3).unwrap(); // Register with the source that will be sending on the given universe.

      let state = MyState {
        src: Arc::new(Mutex::new(src))
      };
      app_handle.manage(state);
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
