# Carmu-ServerPush

2023 Apple Developer Academy @ PORSTECH - MacC - DGC

카뮤 서버 푸시 관련 백엔드 서버입니다.

Firebase Cloud Functions를 이용하여 구현하였습니다.

언어는 Node.js를 사용하였습니다.

추후 작성 예정

<br>
<br>

# 함수

- `pushToReceiver` : 친구 추가를 보냈을 때 해당 친구에게 푸시 알림을 전송합니다.
- `open_session` : 운전자가 세션을 열었을 때, 크루원들에게 푸시 알림을 전송합니다.
- `lateNotification` : 지각버튼을 클릭했을 때, 나머지 인원에게 푸시 알람을 전송합니다.
- `userJoinedNotification` : 동승자가 그룹에 참여하였을 때, 운전자에게 푸시 알림을 전송합니다.
