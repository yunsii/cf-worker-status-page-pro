export class Subrequests {
  total = 0
  notifiedCount = 0
  requiredCount = 0

  required(count = 1) {
    this.requiredCount += count
    this.total += count
  }

  checked() {
    this.total += 1
  }

  notified() {
    this.notifiedCount += 1
    this.total += 1
  }
}
