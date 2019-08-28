'use strict';

module.exports = {
	provider: 'ali',
	dir: './build',
	retry: 3,
	limit: 10,
	timeout: 30000,
	types: ['img', 'js', 'css', 'font'],
	ossOptions: {
		accessKeyId: 'LTAImmIaie4BIJg2',
		accessKeySecret : '2tkE2IpajcCn9y4vQCXMdTlvlBepHp',
		bucket: 'transport-assistant',
		region: 'oss-cn-shenzhen',
		endpoint: 'oss-cn-shenzhen.aliyuncs.com',
		secure: true
	}
};