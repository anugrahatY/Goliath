import cv2
import cv2.aruco as aruco
import numpy as np
import asyncio
import websockets
import json

# ==========================================
# CONFIG
# ==========================================

CAMERA_INDEX = 0

# pixels on map per cm in real world
SCALE = 2.0

# marker id -> map anchor point
# THIS IS THE MARKER'S FIXED POSITION ON MAP

MARKER_MAP = {
    0: (420, 420),
    1: (420, 500),
    2: (420, 580),
    3: (420, 660),

    10: (533, 270),
    11: (635, 270),
    12: (737, 270),

    20: (1505, 450),
}

clients = set()

# ==========================================
# WEBSOCKET
# ==========================================

async def handler(websocket):
    clients.add(websocket)

    try:
        await websocket.wait_closed()

    finally:
        clients.remove(websocket)

async def broadcast_position(x, y):

    if not clients:
        return

    data = json.dumps({
        "x": x,
        "y": y
    })

    await asyncio.gather(
        *[client.send(data) for client in clients]
    )

# ==========================================
# TRACKING
# ==========================================

async def tracking_loop():

    cap = cv2.VideoCapture(CAMERA_INDEX)

    dictionary = aruco.getPredefinedDictionary(
        aruco.DICT_4X4_50
    )

    parameters = aruco.DetectorParameters()

    while True:

        ret, frame = cap.read()

        if not ret:
            continue

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        corners, ids, _ = aruco.detectMarkers(
            gray,
            dictionary,
            parameters=parameters
        )

        if ids is not None:

            for marker_id, corner in zip(ids.flatten(), corners):

                if marker_id not in MARKER_MAP:
                    continue

                pts = corner[0]

                # ==========================================
                # MARKER CENTER IN CAMERA FRAME
                # ==========================================

                cx = np.mean(pts[:, 0])
                cy = np.mean(pts[:, 1])

                # ==========================================
                # FRAME CENTER
                # ==========================================

                frame_h, frame_w = frame.shape[:2]

                frame_cx = frame_w / 2
                frame_cy = frame_h / 2

                # ==========================================
                # OFFSET FROM MARKER
                # ==========================================

                dx_pixels = cx - frame_cx
                dy_pixels = cy - frame_cy

                # ==========================================
                # CONVERT TO MAP DISPLACEMENT
                # ==========================================

                dx_map = dx_pixels * SCALE
                dy_map = dy_pixels * SCALE

                # ==========================================
                # MARKER ANCHOR POSITION
                # ==========================================

                marker_map_x, marker_map_y = MARKER_MAP[marker_id]

                # ==========================================
                # USER POSITION
                # ==========================================

                user_x = marker_map_x - dx_map
                user_y = marker_map_y - dy_map

                # ==========================================
                # SEND TO FRONTEND
                # ==========================================

                await broadcast_position(
                    float(user_x),
                    float(user_y)
                )

                # ==========================================
                # DEBUG DRAWING
                # ==========================================

                cv2.circle(
                    frame,
                    (int(cx), int(cy)),
                    6,
                    (0, 255, 0),
                    -1
                )

                cv2.circle(
                    frame,
                    (int(frame_cx), int(frame_cy)),
                    6,
                    (0, 0, 255),
                    -1
                )

                cv2.putText(
                    frame,
                    f"ID:{marker_id}",
                    (int(cx), int(cy) - 20),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0,255,0),
                    2
                )

                cv2.putText(
                    frame,
                    f"dx:{int(dx_map)} dy:{int(dy_map)}",
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (255,255,255),
                    2
                )

        cv2.imshow("Live Tracking", frame)

        key = cv2.waitKey(1)

        if key == 27:
            break

        await asyncio.sleep(0.03)

    cap.release()
    cv2.destroyAllWindows()

# ==========================================
# MAIN
# ==========================================

async def main():

    server = await websockets.serve(
        handler,
        "0.0.0.0",
        3262
    )

    print("WebSocket running on ws://0.0.0.0:3262")

    await tracking_loop()

asyncio.run(main())
