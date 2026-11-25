// 配置名称: Clash Verge script
// 配置作者: Jahvlen
// 更新时间: 26-11-25

//---------------------------1、覆写dns---------------------------
function overwriteDns(config) {

  // 国内DNS服务器
  const domesticNameservers = [
    "https://dns.alidns.com/dns-query", // 阿里云公共DNS
    "https://doh.pub/dns-query", // 腾讯DNSPod
    "https://doh.360.cn/dns-query" // 360安全DNS
  ];
  
  // 国外DNS服务器
  const foreignNameservers = [
    "https://1.1.1.1/dns-query", // Cloudflare(主)
    "https://1.0.0.1/dns-query", // Cloudflare(备)
    "https://208.67.222.222/dns-query", // OpenDNS(主)
    "https://208.67.220.220/dns-query", // OpenDNS(备)
    "https://194.242.2.2/dns-query", // Mullvad(主)
    "https://194.242.2.3/dns-query", // Mullvad(备)
    ];

  // DNS配置
  const dnsConfig = {
    "enable": true,
    "listen": "0.0.0.0:1053",
    "ipv6": true,
    "use-system-hosts": false,
    "cache-algorithm": "arc",
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter": [
    // 本地主机/设备
    "+.lan",
    "+.local",
    // // Windows网络出现小地球图标
    "+.msftconnecttest.com",
    "+.msftncsi.com",
    // QQ快速登录检测失败
    "localhost.ptlogin2.qq.com",
    "localhost.sec.qq.com",
      // 追加以下条目
    "+.in-addr.arpa", 
    "+.ip6.arpa",
    "time.*.com",
    "time.*.gov",
    "pool.ntp.org",
    // 微信快速登录检测失败
    "localhost.work.weixin.qq.com"
  ],
    "default-nameserver": ["223.5.5.5", "119.29.29.29", "1.1.1.1", "8.8.8.8"],
    "nameserver": [...domesticNameservers, ...foreignNameservers],
    "proxy-server-nameserver": [...domesticNameservers, ...foreignNameservers],
    "nameserver-policy": {
    "geosite:private,cn,geolocation-cn": domesticNameservers,
    "geosite:google,youtube,telegram,gfw,geolocation-!cn": foreignNameservers
    }
  };

  // 覆写原配置中的DNS！！
  config["dns"] = dnsConfig;

}

//---------------------------2、覆写规则--------------------------
function overwriteRules(config) {

  // 规则集通用配置
  const ruleProviderCommon = {
    type: "http",
    format: "yaml",
    interval: 86400,
  };

  // 规则集配置
  const ruleProviders = {
    // 去广告
    reject: {
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Advertising/Advertising_Classical.yaml",
      path: "./rulesets/Advertising_Classical.yaml",
    },

    // Apple直连 
    Apple: {
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple_Classical.yaml",
      path: "./rulesets/Apple_Classical.yaml",
    },
    // Bing直连 
    Bing:{
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Bing/Bing.yaml",
      path: "./rulesets/Bing.yaml",
    },

    // ChatGPT
    ChatGPT:{
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml",
      path: "./rulesets/OpenAI.yaml",
    },
    // Gemini
    Gemini:{
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Gemini/Gemini.yaml",
      path: "./rulesets/Gemini.yaml",
    },
    // Google
    Google:{
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml",
      path: "./rulesets/Google.yaml",
    },
    // YouTube
    YouTube:{
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTube/YouTube.yaml",
      path: "./rulesets/YouTube.yaml",
    },
    // Telegram
    Telegram: {
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.yaml",
      path: "./rulesets/Telegram.yaml",
    },
    // 国外网站
    Global: {
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Global/Global_Classical.yaml",
      path: "./rulesets/Global_Classical.yaml",
    },

    // 直连
    ChinaIPs: {
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaIPs/ChinaIPs_Classical.yaml",
      path: "./rulesets/ChinaIPs_Classical.yaml",
    },
    Lan: {
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Lan/Lan.yaml",
      path: "./rulesets/Lan.yaml",
    }
  };

  // 规则
  const rules = [
    // blackmatrix7 规则集
    // 去广告
    "RULE-SET,reject,REJECT",
    // 直连
    "RULE-SET,Apple,DIRECT",
    "RULE-SET,Bing,DIRECT",
    // 代理
    "RULE-SET,ChatGPT,ChatGPT",
    "RULE-SET,Gemini,Gemini",
    "RULE-SET,Google,Google",
    "RULE-SET,YouTube,YouTube",
    "RULE-SET,Telegram,Telegram",
    "RULE-SET,Global,国外网站",
    // 中国IP
    "RULE-SET,ChinaIPs,DIRECT",
    // 其他规则
    "GEOIP,LAN,DIRECT,no-resolve",
    "GEOIP,CN,DIRECT,no-resolve",
    "MATCH,漏网之鱼",
  ];

  // 覆盖原配置中的规则！！
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;
}

//-------------------------3、覆写代理组---------------------------
function overwriteProxyGroups(config) {

  // 代理组通用配置
  const groupBaseOption = {
    interval: 300,
    timeout: 3000,
    url: "https://www.google.com/generate_204",
    lazy: true,
    "max-failed-times": 3,
    hidden: false,
  };
  
  // 覆盖原配置中的代理组
  const proxyGroups = [
    {
      ...groupBaseOption,
      name: "PROXY",
      type: "select",
      "include-all": true,
      filter: "美国|🇺🇸|US|(?i)UnitedStates",
      proxies: ["美国", "香港", "新加坡", "日本", "台湾"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/Proxy.png",
    },
    {
      ...groupBaseOption,
      name: "ChatGPT",
      type: "select",
      proxies: ["PROXY", "美国", "香港", "新加坡", "日本", "台湾", "DIRECT"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/ChatGPT.png",
    },
    {
      ...groupBaseOption,
      name: "Gemini",
      type: "select",
      "include-all": true,
      filter: "美国|🇺🇸|US|(?i)UnitedStates",
      proxies: ["PROXY", "DIRECT"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/Gemini.png",
    },
    {
      ...groupBaseOption,
      name: "Google",
      type: "select",
      proxies: ["PROXY", "Gemini", "美国", "香港", "新加坡", "日本", "台湾", "DIRECT"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/Google.png",
    },
    {
      ...groupBaseOption,
      name: "YouTube",
      type: "select",
      proxies: ["PROXY", "Gemini", "美国", "香港", "新加坡", "日本", "台湾", "DIRECT"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/YouTube.png",
    },
    {
      ...groupBaseOption,
      name: "Telegram",
      type: "select",
      proxies: ["PROXY", "美国", "香港", "新加坡", "日本", "台湾", "DIRECT"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/Telegram.png",
    },
    {
      ...groupBaseOption,
      name: "国外网站",
      type: "select",
      proxies: ["PROXY", "美国", "香港", "新加坡", "日本", "台湾", "DIRECT"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/Global.png",
    },
    {
      ...groupBaseOption,
      name: "漏网之鱼",
      type: "select",
      proxies: ["PROXY", "美国", "香港", "新加坡", "日本", "台湾", "DIRECT"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/Fish.png",
    },
    // 过滤区域代理组
    {
      ...groupBaseOption,
      name: "美国",
      type: "select",      
      filter: "美国|🇺🇸|US|(?i)UnitedStates",
      "include-all": true,
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/United States.png",
    },
    {
      ...groupBaseOption,
      name: "香港",
      type: "select",
      filter: "香港|🇭🇰|HK|(?i)HongKong",
      "include-all": true,
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/Hong Kong.png",
    },
    {
      ...groupBaseOption,
      name: "新加坡",
      type: "select",
      filter: "新加坡|🇸🇬|SG|(?i)Singapore",
      "include-all": true,
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/Singapore.png",
    },
    {
      ...groupBaseOption,
      name: "日本",
      type: "select",
      filter: "日本|🇯🇵|JP|(?i)Japan",
      "include-all": true,
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/Japan.png",
    },
   {
      ...groupBaseOption,
      name: "台湾",
      type: "select",
      filter: "台湾|🇹🇼|TW|(?i)Taiwan",
      "include-all": true,
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/images/Taiwan.png",
    }
  ];
  
  // 覆盖原配置中的代理组！！
  config["proxy-groups"] = proxyGroups;
}

//---------------------------程序入口------------------------------
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount =
    typeof config?.["proxy-providers"] === "object"
      ? Object.keys(config["proxy-providers"]).length
      : 0;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  overwriteDns(config);
  overwriteRules(config);
  overwriteProxyGroups(config);

  // 返回修改后的配置
  return config;
}