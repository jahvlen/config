// 配置名称: Clash Verge script
// 配置作者: Jahvlen
// 更新时间: 25-07-02 00:00

//---------------------------1、覆写dns---------------------------
function overwriteDns(config) {

  // 国内DNS服务器
  const domesticNameservers = [
    "https://dns.alidns.com/dns-query", // 阿里云公共DNS
    "https://doh.pub/dns-query", // 腾讯DNSPod
    "https://doh.360.cn/dns-query", // 360安全DNS
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
    dns: true,
    listen: 1053,
    ipv6: true,
    "use-hosts": true,
    "cache-algorithm": "arc",
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter": [
      "+.lan",
      "+.local",
      "+.msftconnecttest.com",
      "+.msftncsi.com",
    ],
    "default-nameserver": ["223.5.5.5", "114.114.114.114", "1.1.1.1", "8.8.8.8"],
    nameserver: [...domesticNameservers, ...foreignNameservers],
    "proxy-server-nameserver": [...domesticNameservers, ...foreignNameservers],
    "nameserver-policy": {
      "geosite:private,cn,geolocation-cn": domesticNameservers,
      "geosite:google,youtube,telegram,gfw,geolocation-!cn": foreignNameservers,
    },
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
    reject: {
      ...ruleProviderCommon,
      behavior: "domain",
      url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
      path: "./rulesets/loyalsoldier/reject.yaml",
    },    
    apple: {
      ...ruleProviderCommon,
      behavior: "domain",
      url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt",
      path: "./rulesets/loyalsoldier/apple.yaml",
    },
    icloud: {
      ...ruleProviderCommon,
      behavior: "domain",
      url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
      path: "./rulesets/loyalsoldier/icloud.yaml",
    },

    ChatGPT:{
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml",
      path: "./rulesets/loyalsoldier/OpenAI.yaml",
    },
    telegramcidr: {
      ...ruleProviderCommon,
      behavior: "ipcidr",
      url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
      path: "./rulesets/loyalsoldier/telegramcidr.yaml",
    },
    google: {
      ...ruleProviderCommon,
      behavior: "domain",
      url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt",
      path: "./rulesets/loyalsoldier/google.yaml",
    },
    proxy: {
      ...ruleProviderCommon,
      behavior: "domain",
      url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
      path: "./rulesets/loyalsoldier/proxy.yaml",
    },

    // 直连
    direct: {
      ...ruleProviderCommon,
      behavior: "domain",
      url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
      path: "./rulesets/loyalsoldier/direct.yaml",
    },
    private: {
      ...ruleProviderCommon,
      behavior: "domain",
      url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
      path: "./rulesets/loyalsoldier/private.yaml",
    },  
    cncidr: {
      ...ruleProviderCommon,
      behavior: "ipcidr",
      url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
      path: "./rulesets/loyalsoldier/cncidr.yaml",
    },
    lancidr: {
      ...ruleProviderCommon,
      behavior: "ipcidr",
      url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
      path: "./rulesets/loyalsoldier/lancidr.yaml",
    },
    applications: {
      ...ruleProviderCommon,
      behavior: "classical",
      url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
      path: "./rulesets/loyalsoldier/applications.yaml",
    },
  };

  // 规则
  const rules = [
    // 自定义规则
    "DOMAIN-SUFFIX,googleapis.cn,Google", // Google服务
    "DOMAIN-SUFFIX,gstatic.com,Google", // Google静态资源
    "DOMAIN-SUFFIX,xn--ngstr-lra8j.com,Google", // Google Play下载服务
    "DOMAIN-SUFFIX,github.io,PROXY", // Github Pages
    "DOMAIN,v2rayse.com,PROXY",     // V2rayse节点工具
    // Loyalsoldier 规则集
    "RULE-SET,reject,REJECT",
    "RULE-SET,icloud,DIRECT",
    "RULE-SET,apple,DIRECT",

    "RULE-SET,ChatGPT,ChatGPT",
    "RULE-SET,telegramcidr,Telegram,no-resolve",
    "RULE-SET,google,Google",
    "RULE-SET,proxy,国外网站",

    "RULE-SET,applications,DIRECT",
    "RULE-SET,private,DIRECT",
    "RULE-SET,direct,DIRECT",
    "RULE-SET,lancidr,DIRECT,no-resolve",
    "RULE-SET,cncidr,DIRECT,no-resolve",
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
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/icons/Proxy.png",
    },
    {
      ...groupBaseOption,
      name: "ChatGPT",
      type: "select",
      proxies: ["PROXY", "美国", "英国", "新加坡", "日本", "台湾", "香港", "DIRECT"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/icons/ChatGPT.png",
    },
    {
      ...groupBaseOption,
      name: "Telegram",
      type: "select",
      proxies: ["PROXY", "美国", "英国", "新加坡", "日本", "台湾", "香港", "DIRECT"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/icons/Telegram.png",
    },
    {
      ...groupBaseOption,
      name: "Google",
      type: "select",
      proxies: ["PROXY", "美国", "英国", "新加坡", "日本", "台湾", "香港", "DIRECT"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/icons/Google.png",
    },
    {
      ...groupBaseOption,
      name: "国外网站",
      type: "select",
      proxies: ["PROXY", "美国", "英国", "新加坡", "日本", "台湾", "香港", "DIRECT"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/icons/Global.png",
    },
    {
      ...groupBaseOption,
      name: "漏网之鱼",
      type: "select",
      proxies: ["PROXY", "美国", "英国", "新加坡", "日本", "台湾", "香港", "DIRECT"],
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/icons/fish.svg",
    },
    // 过滤区域代理组
    {
      ...groupBaseOption,
      name: "美国",
      type: "select",      
      filter: "美国|🇺🇸|US|(?i)UnitedStates",
      "include-all": true,
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/icons/United States.png",
    },
    {
      ...groupBaseOption,
      name: "英国",
      type: "select",
      filter: "英国|🇬🇧|UK|(?i)UnitedKingdom",
      "include-all": true,
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/icons/United Kingdom.png",
    },
    {
      ...groupBaseOption,
      name: "新加坡",
      type: "select",
      filter: "新加坡|🇸🇬|SG|(?i)Singapore",
      "include-all": true,
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/icons/Singapore.png",
    },
    {
      ...groupBaseOption,
      name: "日本",
      type: "select",
      filter: "日本|🇯🇵|JP|(?i)Japan",
      "include-all": true,
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/icons/Japan.png",
    },
   {
      ...groupBaseOption,
      name: "台湾",
      type: "select",
      filter: "台湾|🇹🇼|TW|(?i)Taiwan",
      "include-all": true,
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/icons/Taiwan.png",
    },
    {
      ...groupBaseOption,
      name: "香港",
      type: "select",
      filter: "香港|🇭🇰|HK|(?i)HongKong",
      "include-all": true,
      icon: "https://raw.githubusercontent.com/jahvlen/config/main/icons/Hong Kong.png",
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