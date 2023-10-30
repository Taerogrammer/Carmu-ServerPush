# Carmu-ServerPush

2023 Apple Developer Academy @ PORSTECH - MacC - DGC

카뮤 서버 푸시 관련 백엔드 서버입니다.

Firebase Cloud Functions를 이용하여 구현하였습니다.

언어는 Node.js를 사용하였습니다.

추후 작성 예정

<br>
<br>

# 함수

- `lateNotification` : 지각버튼을 클릭했을 때, 나머지 인원에게 푸시 알람을 전송합니다.
- `userJoinedNotification` : 동승자가 그룹에 참여하였을 때, 운전자에게 푸시 알림을 전송합니다.
- `journeyStartNotification` : 운전을 시작하였을 때, 동승자들에게 푸시 알림을 전송합니다.
- `leftGroupNotification` : 누군가가 그룹을 나갔을 때, 해당 그룹 인원들에게 푸시 알림을 전송합니다.
- `groupInfoChangedNotification` : 그룹에 대한 정보가 수정되었을 때, 해당 그룹 인원들에게 푸시 알림을 전송합니다.
- `giveupNotification` : 여정 도중 동승자가 함께 가기를 포기하였을 때, 푸시 알림을 전송합니다.