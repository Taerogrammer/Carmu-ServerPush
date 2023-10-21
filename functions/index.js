const functions = require("firebase-functions");
const admin = require("firebase-admin");

const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

admin.initializeApp();
const firestore = admin.firestore();
const messaging = admin.messaging();

// 세션을 열었을 때 크루원들에게 서버 푸시를 보내주는 함수
exports.open_session = onRequest(async (req, res) => {
    try {
      // 대상 디바이스의 토큰 배열
      const tokens = req.body.data.tokens; // 이제 tokens 배열로부터 토큰을 가져옵니다.
      console.log("Token --> ", tokens)
  
      if (!Array.isArray(tokens)) {
        return res.status(400).json({ error: "Invalid 'tokens' parameter. It should be an array." });
      }
  
      // 푸시 메시지 설정
      const messages = tokens.map((token) => ({
        notification: {
          title: "카뮤",
          body: "운전자가 여정을 시작하였어요!",
        },
        token: token,
      }));
  
      // 여러 푸시 메시지 전송
      const responses = await Promise.all(messages.map((message) => messaging.send(message)));
      console.log("Successfully sent messages:", responses);
  
      res.status(200).json({ success: true, data: responses });
  
    } catch (error) {
      console.error("Error Sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

// 세션을 열었을 때 크루원들에게 서버 푸시를 보내주는 함수
exports.pushToReceiver = onRequest(async (req, res) => {
    try {
      // 대상 디바이스의 토큰 배열
      const token = req.body.data.token; // 이제 tokens 배열로부터 토큰을 가져옵니다.
      console.log("Token --> ", token)

        // 푸시 메시지 설정
        const messages = [
        {
            notification: {
            title: "카뮤",
            body: "새로운 친구가 추가되었어요!",
            },
            token: token, // 수정된 토큰 값
        },
        ];
  
      // 여러 푸시 메시지 전송
      const responses = await Promise.all(messages.map((message) => messaging.send(message)));
      console.log("Successfully sent messages:", responses);
  
      res.status(200).json({ success: true, data: responses });
  
    } catch (error) {
      console.error("Error Sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });