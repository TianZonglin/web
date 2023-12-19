$(document).ready(function () {
  
  let storeid = [];
  let storeid_p = [];
  let storec = null;
  let storet = null;
  let stored = null;
  let storejarr = null;

  let storetmp = null;
  let storefunc = null;

  let storetag = null;
  let storeclass = null;
  
  lightbox.option({
    resizeDuration: 100,
    wrapAround: true,
    albumLabel: "",
  });

  let itemsPerBatch = 13; // 每批加载的数量
  let loadedItems = 0; // 已加载的数量
  let stopLoad = false; //如果点down就不触发滚动加载

  let qs = window.location.search;
  let up = new URLSearchParams(qs);
  if (up.get("t") != null) {
    storetag = up
      .get("t")
      .replaceAll(/%20/g, "")
      .replaceAll(" ", "")
      .split(",");
  }else if (up.get("c") != null) {
    storeclass = up
      .get("c")
      .replaceAll(/%20/g, "")
      .replaceAll(" ", "")
      .split(",");
  } 
  
  fetch(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjLHFu3SqqXZHqA5ZVrO7A1U6ozpdwn93EHlHRGY8A5AY0VlzR5xx4sCIqJ0bEJ9tHMDxGJmcZqYLL/pub?gid=655900093&single=true&output=csv"
    
  )
    .then((response) => response.text())
    .then((data) => {
      let flag =
        (iNo =
        iClass =
        iTime =
        iName =
        iPrice =
        iPackage =
        iTags =
        iFresh =
        iAppearance =
        iStatus =
        iDate =
        iUsers = 
          null);
      let jarr = [];
      let lines = data.split("\n");
      let arr = lines[0].split(",");

      for (let i = 0; i < arr.length; i++) {
        switch (arr[i]) {
          case "NO":
            iNo = i;
            break;
          case "分类":
            iClass = i;
            break;
          case "时间":
            iTime = i;
            break;
          case "名称":
            iName = i;
            break;
          case "总价/欧元":
            iPrice = i;
            break;
          case "包装":
            iPackage = i;
            break;
          case "主题分类":
            iTags = i;
            break;
          case "新旧/全新1.0":
            iFresh = i;
            break;
          case "外观":
            iAppearance = i;
            break;
          case "状态":
            iStatus = i;
            break;
          case "用户":
            iUsers = i;
            break;
          case "更新时间":
            iDate = i;
            break;
          default:
            console.log("meet unknown ",arr[i]);
        }
      }
      for (let i = 1; i < lines.length; i++) {

        let items = lines[i].split(","); 
        jarr.push({
          iNo: items[iNo],
          iClass: items[iClass],
          iTime: items[iTime],
          iUsers: items[iUsers],
          iName: items[iName],
          iPrice: items[iPrice],
          iPackage: items[iPackage],
          iTags: items[iTags],
          iFresh: items[iFresh],
          iAppearance: items[iAppearance],
          iStatus: items[iStatus],
          iDate: items[iDate].replaceAll(/\r/g, ""),
        });

        storeid_p[parseFloat(items[iNo])] = parseFloat(items[iPrice]);

      }

      function isArrayInArray(arrayA, arrayB) {
        for (let i = 0; i < arrayA.length; i++) {
          if (arrayB.includes(arrayA[i])) {
            return true;
          }
        }
        return false;
      }
      if(storetag!=null){
        jarr = jarr.filter((obj) => isArrayInArray(storetag,obj.iTags));
      }else if(storeclass!=null){
        jarr = jarr.filter((obj) => isArrayInArray(storeclass,obj.iClass));
      }
    
      storejarr = jarr;
      //jarr = jarr.filter((obj) => (obj.iTime == "Now"));
      jarr = jarr.filter((obj) => (obj.iStatus != "SOLD"));   //按类别排序
      jarr.sort(function (a, b) {
        var propertyA = parseFloat(a.iPrice);
        var propertyB = parseFloat(b.iPrice);
        if (propertyA < propertyB) return 1;
        if (propertyA > propertyB) return -1;
        return 0;
      });
      jarr.sort(function (a, b) {
        var propertyA = a.iStatus; //parseInt(a.iTags);
        var propertyB = b.iStatus; //parseInt(b.iTags);
        if (propertyB == "SOLD") return -1;
        return 0;
      });
      storejarr.sort(function (a, b) {
        var propertyA = a.iStatus; //parseInt(a.iTags);
        var propertyB = b.iStatus; //parseInt(b.iTags);
        if (propertyB == "SOLD") return -1;
        return 0;
      });
    
    
      //不重复的标签
      let uniqueTags = $.map(jarr, function (obj) {
        return obj.iTags.split(" ");
      })
        .filter(function (element) {
          return element !== "";
        })
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });

      function moveElementsWithLettersToEnd(arr) {
        const lettersRegex = /[a-zA-Z]/; // 正则表达式，用于匹配字母
        const lettersElements = arr.filter((item) => lettersRegex.test(item)); // 过滤含有字母的元素
        const nonLettersElements = arr.filter(
          (item) => !lettersRegex.test(item)
        ); // 过滤不含字母的元素

        return nonLettersElements.concat(lettersElements); // 将不含字母的元素和含有字母的元素合并，含有字母的元素将在最后
      }

      uniqueTags = moveElementsWithLettersToEnd(uniqueTags);

      //不重复的类别
      let uniqueClass = $.map(jarr, function (obj) {
        return obj.iClass;
      }).filter(function (value, index, self) {
        return self.indexOf(value) === index;
      });

      //生成标签
      //$("#cls").html(
      ////  $.map(uniqueClass, function (v) {
      ////    return (
      //      '<button class="btnc outline" value="' + v + '">' + v + "</button>"
      //    );
      //  }).join("")
      //);

      $("#tag").html(
        $.map(uniqueTags, function (v) {
          return (
            '<button class="btnt outline" value="' + v + '">' + v + "</button>"
          );
        }).join("")
      );



      function calculateSumAtIndexes(A, B) {
        var sumArray = [];
        for (var i = 0; i < B.length; i++) {
          var index = B[i];
          if (index >= 0 && index < A.length) {
            sumArray.push(A[index]);
          } else {
            sumArray.push(0); // 如果索引越界，则添加 0
          }
        }
        return $.map(sumArray, (num) => num).reduce((a, b) => a + b, 0);
      }



      let today = new Date();
      //不重复的标签
      let newjarr = $.grep(jarr, function (obj) { 
  
        let tmp = obj.iDate.split("-");
        return (parseInt(tmp[1]) == today.getMonth() + 1) && (parseInt(tmp[2]) + 7 > today.getDate());
       
      });
    
  

      //不重复的标签
      let uniqueDayTags = $.map(newjarr, function (obj) {
        return obj.iTags.split(" ");
      })
        .filter(function (element) {
          return element !== "";
        })
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });

      if (uniqueDayTags != "") {
        $("#day").html(
          $.map(moveElementsWithLettersToEnd(uniqueDayTags), function (v) {
            return (
              '<button class="btnt outline" value="' +
              v +
              '">' +
              v +
              "</button>"
            );
          }).join("")
        );
        $(".containerd").show();
      }


      if(storetag!=null||storeclass!=null){
        $("#cls").append(
            '<button class="btnc outline" style="display:none" id="sqhidec" value="reset">收起</button>'
        ); 
      }else{
        $("#cls").append(
            '<button class="btnc outline" value="price10">10欧及以上</button>' +
            '<button class="btnc outline" value="price5">5~9欧</button>' +
            '<button class="btnc outline" value="price1">1~4欧</button>' +
            //'<button class="btnc outline" value="fresh8">八成新</button>' +
            '<button class="btnc outline" value="zero">免费送</button>' +
            '<button class="btnc outline" style="display:none" id="sqhidec" value="reset">收起</button>'
        );
      }


      $("#tag").append(
        '<button class="btnt outline" style="display:none" id="sqhidet" value="reset">收起</button>'
      );
      $("#day").append(
        '<button class="btnt outline" style="display:none" id="sqhided" value="reset">收起</button>'
      );




      $("#containerc").on("click", ".btnc", function () {
        let temp;
        $(".btnc").removeClass("active");

        if (event.target.value != "reset") {
          $(this).addClass("active");
          $("#sqhidec").show();
          storec = event.target.value;
        } else {
          $(this).removeClass("active");
          $("#sqhidec").hide();
          storec = null;
        }
        if (event.target.value == "zero") {
          temp = $.grep(jarr, function (obj) {
            return obj.iPrice == 0;
          });
        } else if (event.target.value == "fresh") {
          temp = $.grep(jarr, function (obj) {
            return obj.iFresh.includes("1.0");
          });
        } else if (event.target.value == "fresh9") {
          temp = $.grep(jarr, function (obj) {
            return obj.iFresh.includes("0.9");
          });
        } else if (event.target.value == "price1") {
          temp = $.grep(jarr, function (obj) {
            return obj.iPrice > 0 && obj.iPrice < 5;
          });
        } else if (event.target.value == "price5") {
          temp = $.grep(jarr, function (obj) {
            return obj.iPrice > 4 && obj.iPrice < 10;
          });
        } else if (event.target.value == "price10") {
          temp = $.grep(jarr, function (obj) {
            return obj.iPrice >= 10;
          });
        } else if (event.target.value == "fresh8") {
          temp = $.grep(jarr, function (obj) {
            return obj.iFresh.includes("0.8");
          });
        } else if (event.target.value == "package") {
          temp = $.grep(jarr, function (obj) {
            return obj.iPackage.includes("$");
          });
        } else {
          temp = $.grep(jarr, function (obj) {
            return obj.iClass.includes(event.target.value);
          });
        }
        //creats("#cls_content", temp, "按品类排序：", false);

        loadedItems = 0;
        itemsPerBatch = 10;
        if (window.innerWidth < 768) {
          itemsPerBatch = 5;
        }
        storefunc = "indexClass";
        storetmp = temp;
        $("#cls_content").html("");
        creats("#cls_content", storetmp, "按价格排序：", true);
      });

      $(window).on("scroll", () => {
        const scrollPosition = $(window).scrollTop();
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();
        if(!stopLoad){
          if (
            storefunc == "indexClass" &&
            scrollPosition + windowHeight >= documentHeight - 150
          ) {
            creats("#cls_content", storetmp, "按价格排序：", true);
          } else if (
            storefunc == "indexAll" &&
            scrollPosition + windowHeight >= documentHeight - 150
          ) {
            creats("#blist", storetmp, "按价格排序：", true);
          } else {}
        }
      });
      $("body").on("click", "#appendmore", function () {
        if (storefunc == "indexClass") {
          creats("#cls_content", storetmp, "按价格排序：", true);
        } else if (storefunc == "indexAll") {
          creats("#blist", storetmp, "按价格排序：", true);
        } else {
        }
      });



      $("#containert").on("click", ".btnt", function () {
        $(".btnt").removeClass("active");

        if (event.target.value != "reset") {
          $("#sqhidet").show();
          $(this).addClass("active");
          storet = event.target.value;
        } else {
          $(this).removeClass("active");
          $("#sqhidet").hide();
          storet = null;
        }
        let temp = $.grep(jarr, function (obj) {
          return obj.iTags.includes(event.target.value);
        });
        creats("#tag_content", temp, "按价格排序：", false);
        //$("#olist").show();
      });

      $("#containerd").on("click", ".btnt", function () {
        $(".btnt").removeClass("active");

        if (event.target.value != "reset") {
          $("#sqhided").show();
          $(this).addClass("active");
          stored = event.target.value;
        } else {
          $(this).removeClass("active");
          $("#sqhided").hide();
          $(".day_content").hide();
          stored = null;
        }
        let temp = $.grep(jarr, function (obj) {
          let tp = obj.iDate.split("-");
          return (
            obj.iTags.includes(event.target.value) &&
            (parseInt(tp[1]) == today.getMonth() + 1) && (parseInt(tp[2]) + 7 > today.getDate())
       
          );
        });
        creats("#day_content", temp, "<br>按价格排序：", false);
        //$("#olist").show();
      });

      // 点击加号
      $("body").on("click", ".icon-overlay", function () {
        let val = $(this).attr("value");
        let val_p = parseFloat($(this).attr("value_p"));
        let isAdding = JSON.parse($(this).attr("flag"));

        $(this).toggleClass("icon-clicked");

        if (isAdding) {
          if (!storeid.includes(val)) {
            storeid.push(val);

            creats(
              "#olist",
              jarr.filter((obj) => storeid.includes(obj.iNo)),
              "<b>物品总价：€ " +
                 calculateSumAtIndexes(storeid_p, storeid)  +
                "<br>物品编号：" +
                storeid.toString().replaceAll(",", ", ") +
                "</b>",
              false
            );
          }
        } else {
          if (storeid.length > 0) {
            storeid = storeid.filter((element) => element !== val);
            creats(
              "#olist",
              jarr.filter((obj) => storeid.includes(obj.iNo)),
              "<b>物品总价：€ " +
                 calculateSumAtIndexes(storeid_p, storeid)  +
                "<br>物品编号：" +
                storeid.toString().replaceAll(",", ", ") +
                "</b>",
              false
            );
            if (storeid.length == 0) {
              $("#olist").html("已选物品：无");
              updateTextWithColorChange(0, storeid.length, "#dtxt");
            }

            let xtmp;
            //console.log(storet,storec);
            if (storet != null) {
              xtmp = $.grep(jarr, function (obj) {
                return obj.iTags.includes(storet);
              });
              creats("#tag_content", xtmp, "按价格排序：", false);
            }
            //console.log(stored,storec);
            if (stored != null) {
              xtmp = $.grep(jarr, function (obj) {
                return (
                  obj.iTags.includes(stored) &&
                  obj.iDate.includes(
                    [
                      today.getFullYear(),
                      today.getMonth() + 1,
                      today.getDate(),
                    ].join("-")
                  )
                );
              });
              creats("#day_content", xtmp, "<br>按价格排序：", false);
            }
            if (storec != null && storec == "all") {
              creats("#blist", jarr, "按价格排序：", false);
            } else {
              if (storec == "zero") {
                xtmp = $.grep(jarr, function (obj) {
                  return obj.iPrice == 0;
                });
              } else if (storec == "fresh") {
                xtmp = $.grep(jarr, function (obj) {
                  return obj.iFresh.includes("1.0");
                });
              } else if (storec == "fresh9") {
                xtmp = $.grep(jarr, function (obj) {
                  return obj.iFresh.includes("0.9");
                });
              } else if (storec == "fresh8") {
                xtmp = $.grep(jarr, function (obj) {
                  return obj.iFresh.includes("0.8");
                });
              } else if (storec == "package") {
                xtmp = $.grep(jarr, function (obj) {
                  return obj.iPackage.includes("$");
                });
              } else {
                xtmp = $.grep(jarr, function (obj) {
                  return obj.iClass.includes(storec);
                });
              }
              creats("#cls_content", xtmp, "按价格排序：", false);
            }
          }
        }

        $(this).attr("flag", !isAdding);
      });


      $(".inav").removeClass("actblack");


      $("#anav").click(function () {
        $("#alist").html("");
        $(".inav").removeClass("actblack");
        $(this).addClass("actblack");
        $(".text").hide();
        $("#alist").show();
        $("#alist").append(
          "序号,&nbsp;用户,&nbsp;分类,&nbsp;新旧/全新1.0,&nbsp;名称,&nbsp;总价/欧元,&nbsp;可售时间,&nbsp;包装,&nbsp;主题分类,&nbsp;外观,&nbsp;状态,&nbsp;<br>"
        );
        //conso//le.log(jarr);
        for (let i = 0; i < storejarr.length; i++) {

          let no = storejarr[i].iNo;
          if (parseInt(no) < 10) no = "00" + no;
          else if (parseInt(no) < 100) no = "0" + no;
          if (storejarr[i].iStatus == "SOLD")
            $("#alist").append(
              "<span style='color:red'>No." +
                no +
                ",&nbsp;" +                
                storejarr[i].iUsers +
                ",&nbsp;" +
                storejarr[i].iClass +
                ",&nbsp;" +
                getFresh2(storejarr[i].iFresh) +
                ",&nbsp;" +
                storejarr[i].iName +
                ",&nbsp;" +
                storejarr[i].iPrice +
                ",&nbsp;" +
                storejarr[i].iTime +
                ",&nbsp;" +
                storejarr[i].iPackage +
                ",&nbsp;" +
                storejarr[i].iTags +
                ",&nbsp;" +
                storejarr[i].iAppearance +
                ",&nbsp;" +
                storejarr[i].iStatus +
                ",&nbsp;</span><br>"
            );
          else
            $("#alist").append(
              "No." +
                no +
                ",&nbsp;" +                
                storejarr[i].iUsers +
                ",&nbsp;" +
                storejarr[i].iClass +
                ",&nbsp;" +
                getFresh2(storejarr[i].iFresh) +
                ",&nbsp;" +
                storejarr[i].iName +
                ",&nbsp;" +
                storejarr[i].iPrice +
                ",&nbsp;" +
                storejarr[i].iTime +
                ",&nbsp;" +
                storejarr[i].iPackage +
                ",&nbsp;" +
                storejarr[i].iTags +
                ",&nbsp;" +
                storejarr[i].iAppearance +
                ",&nbsp;" +
                storejarr[i].iStatus +
                ",&nbsp;<br>"
            );
        }
        $("#enav").attr(
          "href",
          "https://translate.google.com/translate?sl=auto&tl=en&u=web-zeta-lyart.vercel.app
/csv.html"
        );
        $("#enav").show();
        if (isWeChatBrowser()) {
          $("#enav").hide();
        }
      });

      $("#bnav").click(function () {
        itemsPerBatch = 13;
        if (window.innerWidth < 768) {
          itemsPerBatch = 5;
        }
        loadedItems = 0;
        storefunc = "indexAll";

        storec = "all";
        $(".inav").removeClass("actblack");
        $(this).addClass("actblack");
        $(".text").hide();
        $("#enav").attr(
          "href",
          "https://translate.google.com/translate?sl=auto&tl=en&u=web-zeta-lyart.vercel.app
/all.h_tml"
        );
        $("#enav").show();
        $("#blist").html("");
        $("#blist").show();
        // 检测滚动事件，当用户接近底部时触发加载更多内容

        storetmp = jarr;

        creats("#blist", storetmp, "按价格排序：", true);

        if (isWeChatBrowser()) {
          $("#enav").hide();
        }
      });

      $("#cnav").click(function () {
        $(".inav").removeClass("actblack");
        $(this).addClass("actblack");
        $(".text").hide();
        $("#clist").show();
        $("#enav").hide();
        //$("#olist").show();
      });

      $("#dnav").click(function () {
        $(".inav").removeClass("actblack");
        $(this).addClass("actblack");
        $("#alist").hide();
        $("#blist").hide();
        $("#clist").hide();
        $("#olist").show();
      });



      function getFresh(number) {
        const chineseNumberMap = {
          1: "一成新",
          2: "二成新",
          3: "三成新",
          4: "四成新",
          5: "五成新",
          6: "六成新",
          7: "七成新",
          8: "八成新",
          9: "九成新",
          10: "全新",
        };

        return chineseNumberMap[number * 10] || "";
      }
      function getFresh2(number) {
        const chineseNumberMap = {
          1: "一成新",
          2: "二成新",
          3: "三成新",
          4: "四成新",
          5: "五成新",
          6: "六成新",
          7: "七成新",
          8: "八成新",
          9: "九成新",
          10: "完全新",
        };

        return chineseNumberMap[number * 10] || "";
      }

      // 更新文本内容并添加颜色变化效果
      function updateTextWithColorChange(newText, id) {
        $(id).css("transition", "color 1s");
        $(id).css("color", "red");
        $(id).text(newText);

        setTimeout(function () {
          $(id).css("color", "");
          $(id).css("transition", "");
        }, 1000); // 1000 毫秒 = 1 秒
      }


      function creats(ct, tmp, txt, mx) {
        let tmp_l = tmp.length;
        let htmltext = "";
        txt = '<span class="orders" style="font-size: 13px">' + txt + "</span><br><br>";
        if (mx) {
          tmp = tmp.slice(loadedItems, loadedItems + itemsPerBatch);
          //console.log(tmp);
          if (tmp.length == 0 || loadedItems != 0) txt = "";
        } else {
          if (tmp.length == 0) txt = "";
        }
        let gray = "";
        if (window.innerWidth < 768) {
          htmltext =
            txt +
            $.map(tmp, function (v) {
              let pt = v.iPrice;
              
              if (v.iTime == "Oct") pt = v.iPrice + " / get it after 10.1";
              if (v.iStatus == "SOLD"){
                gray = " style='filter: grayscale(80%) contrast(0.5);' ";//pointer-events: none;
                pt = v.iPrice + "<span> × SOLD</span>";
              }else{
                gray = "";
              }
                

              let no = v.iNo;
              if (parseInt(no) < 10) no = "00" + no;
              else if (parseInt(no) < 100) no = "0" + no;

              let trr = v.iAppearance.split(" ");

              let htm =
                '<div   '+ gray +' class="iboxLine">' +
                $.map(trr, function (e) {
                  if (e == "") e = "00000";
                  //else if (e.indexOf("X") < 0) e = e + ".jpg";
                  //else e = e + ".png";
                  return (
                    '<a href="https://cdn.jsdelivr.net/gh/zonelyn/img/' +
                    e +
                    '" data-lightbox="image-1" data-title="' +
                    v.iName +" / "+
                    " €" +
                    v.iPrice +
                    '">' +
                    '<img class="img" src="https://cdn.jsdelivr.net/gh/zonelyn/img/' +
                    e +
                    '" /></a>'
                  );
                }).join("");

              let clk_flag = true;
              let clk_url =
                "https://cdn.glitch.global/f1c7b686-0e39-43f2-8186-adb49d7f1137/pluss.png?v=1692143457820";
              if ($.inArray(v.iNo, storeid) !== -1) {
                clk_flag = false;
                clk_url =
                  "https://cdn.glitch.global/f1c7b686-0e39-43f2-8186-adb49d7f1137/okk.png?v=1692145326322";
              }

              htm +=
                '<div'+ gray +' class="text-overlay"><b><span class="intro">No.' +
                no +
                "</span><br><span class='intro'>" +
                v.iName +
                "</span><br>";

            
              if (v.iTags != "") {
                htm +=
                  "  <span class='intro'>" +
                  getFresh(v.iFresh) +
                  " / " +
                  $.map(v.iTags.split(" "), function (e) {
                    return e;
                  }).join(" / ") +
                  "</span><br>";
              }

              htm += '<span class="intro" style="color:#FF9595">€' + pt + "</span></div>";
              htm +=
                '<div class="text-overlay-user"><b><span style="color:#00000080">#' +
                v.iUsers +
                "**</span></div>";
            
            
              if (v.iStatus != "SOLD" && storetag==null && storeclass==null )
                htm +=
                  '<img style="background-color:white" value="' +
                  v.iNo +
                  '" value_p="' +
                  v.iPrice +
                  '" class="icon-overlay" flag="' +
                  clk_flag +
                  '" src="' +
                  clk_url +
                  '"/>';
              htm += "</b></div>";

              return htm;
            }).join(" ");
        } else {
          htmltext =
            txt +
            $.map(tmp, function (v) {
              let pt = v.iPrice;
              let tags = "";
              //if (v.iFresh == "1.0") tags += "[全新] ";
              //if (v.iPackage == "$") tags += "[带包装] ";

              if (v.iTime == "Oct") pt = v.iPrice + " / get it after 10.1";
              if (v.iStatus == "SOLD"){
                gray = " style='filter: grayscale(80%) contrast(0.5);'";//pointer-events: none;
                pt = v.iPrice + "<span> × SOLD</span>";
              }else{
                gray = "";
              }
                

              let no = v.iNo;
              if (parseInt(no) < 10) no = "00" + no;
              else if (parseInt(no) < 100) no = "0" + no;

              let trr = v.iAppearance.split(" ");

              let tmphtm = "<br>";
              if (v.iTags != "") {
                tmphtm +=
                  "<span class='intro'>" +
                  $.map(v.iTags.split(" "), function (e) {
                    return e;
                  }).join(" / ") +
                  "</span>";
              }

              let htm =
                '<div  '+ gray +' class="ibox">' +
                $.map(trr, function (e) {
                  if (e == "") e = "00000";
                  //else if (e.indexOf("X") < 0) e = e + ".jpg";
                  //else e = e + ".png";
                  return (
                    '<a href="https://cdn.jsdelivr.net/gh/zonelyn/img/' +
                    e +
                    '" data-lightbox="image-1" data-title="' +
                    "No." +
                    v.iNo +
                    " / " +
                    v.iName +" / "+
                    " €" +
                    v.iPrice +
                    '">' +
                    '<img src="https://cdn.jsdelivr.net/gh/zonelyn/img/' +
                    e +
                    '" /></a>'
                  );
                }).join("") +
                '<br><span class="intro">' +
                v.iName +
                "</span>" +
                tmphtm +
                '<br><span class="intro" style="color:#FF9595"><b>€ ' +
                pt +
                "</b></span>";

            
            
              if (tags != "") {
                htm += "  <span class='intro'>" + tags + "</span>";
              }

              let clk_flag = true;
              let clk_url =
                "https://cdn.glitch.global/f1c7b686-0e39-43f2-8186-adb49d7f1137/pluss.png?v=1692143457820";
              if ($.inArray(v.iNo, storeid) !== -1) {
                clk_flag = false;
                clk_url =
                  "https://cdn.glitch.global/f1c7b686-0e39-43f2-8186-adb49d7f1137/okk.png?v=1692145326322";
              }

              htm += '<div    '+ gray +' class="text-overlay"><span>' + no + "</span></div>";
              if (v.iStatus != "SOLD" && storetag==null && storeclass==null )
                htm +=
                  '<img style="background-color:white" value="' +
                  v.iNo +
                  '" value_p="' +
                  v.iPrice +
                  '" class="icon-overlay" flag="' +
                  clk_flag +
                  '" src="' +
                  clk_url +
                  '"/>';
            
              //htm +=
              //  '<div class="text-overlay-user" style="font-size:5px !important;color:#00000080;bottom:4px !important;right:4px !important;"><b><span>#' +
              //  v.iUsers +
              //  "**</span></div>";
            
              htm += "</div>";

              return htm;
            }).join(" ");
        }

        if (mx) {
          loadedItems += itemsPerBatch;

          $(".jump-text").hide();

          let iimg = "<img  style='margin-bottom:-2px;height:13px' class='ldimg loadimg' src='https://cdn.glitch.global/f1c7b686-0e39-43f2-8186-adb49d7f1137/loading.gif?v=1691874362695' />";
          if (isWeChatBrowser()) {iimg = "";}
          if (loadedItems < tmp_l) {
            htmltext +=
              "<div class='jump-text' style='margin-bottom:15px;'>" +
              iimg +
              "<a id='appendmore' value='" +
              loadedItems +
              "' style='text-decoration:none;cursor:pointer'>" +
              "<span  class='ldimg' style='font-size:13px;margin-right:10px'> scroll or click here to load more items." +
              "</span></a></div>";
          }
          $(ct).append(htmltext);
        } else $(ct).html(htmltext);

        updateTextWithColorChange(storeid.length, "#dtxt");
        //updateTextWithColorChange(" scroll or click to load more items.", ".ldimg");
      }


      $("#olist").hide();
    
    
      let currentDate = new Date();
      let count = jarr.filter(function (obj) {
        return obj.iStatus == "SOLD";
      }).length;
      if(storetag!=null||storeclass!=null){

        $("#bnav").click();
        $("#cnt").html(
          "当前总量: " +
            jarr.length +
            "(" +
            count +
            "), 自取地址: <a href='https://maps.app.goo.gl/1xSBcypjtKVDYpbz5' style='color:blue'>3552AS</a> <a style='float:right'>更新: " +
            currentDate.toDateString() +
            "</a>"
        );
        
        
  
        $("#cnt").hide();
        $(".navbar").hide();
        $(".orders").hide();
        $(".bluelist").hide();
        $("#downBtnss").hide();
        $("#downBtn").hide();
        $(".icon-overlay").hide();
        $(".body-content").css("padding-top", "0px");
        
        
      }else if(up.get("v") != null){
        $(".inav").removeClass("actblack");
        $("#dnav").addClass("actblack");

        storeid = up
          .get("v")
          .replaceAll(/%20/g, "")
          .replaceAll(" ", "")
          .split(",");
        //console.log(storeid);
             storejarr = storejarr.filter((obj) => storeid.includes(obj.iNo)); 
        creats( 
          "#olist", 
          storejarr, 
          "<b>物品总价：€ <span id='countall'></span>" + 
          "<br>物品编号：" + 
          storeid.toString().replaceAll(",", ", ") + 
          "</b>", 
        false );     $("#alist").hide();
        $("#blist").hide();
        $("#clist").hide();
        $("#olist").show();
        $("#elist").show();

        $("#countall").html("<b>"+ calculateSumAtIndexes(storeid_p, storeid) +"</b>");
        
        $("#cnav").hide();
        $("#bnav").hide();
        $("#anav").hide();
        $(".tlt").hide();

        count = jarr.filter(function (obj) {
          return obj.iStatus == "SOLD";
        }).length; 
        
        $("#cnt").html(
          "当前总量: " +
            jarr.length +
            "(" +
            count +
            "), 自取地址: <a href='https://maps.app.goo.gl/1xSBcypjtKVDYpbz5' style='color:blue'>3552AS</a> <a style='float:right'>更新: " +
            currentDate.toDateString() +
            "</a>"
        );
        
 
        
      }else if(up.get("x") != null){
        $("#cnav").addClass("actblack");
        $("#cnt").html(
          "当前总量: " +
            jarr.length +
            "(" +
            count +
            "), 自取地址: <a href='https://maps.app.goo.gl/1xSBcypjtKVDYpbz5' style='color:blue'>3552AS</a> <a style='float:right'>更新: " +
            currentDate.toDateString() +
            "</a>"
        );
      }else{
        //$("#clist").hide();
        //$(".bluelist").hide();
        //$("#users").show();
          
      }
     

      
      $("body").show();
 
    })
    .catch((error) => {
      console.log("Error:", error);
    });
    
    
  
    $(".url").click(function() {
      if(storeid.length==0){
        alert("您未选择任何物品。");
      }else{
        try {
          let textToCopy = "web-zeta-lyart.vercel.app/?v="
                +$.map(storeid, function (e) { return e}).join(",");

          // 创建一个临时的 textarea 元素
          let tempTextarea = $("<textarea>");
          $("body").append(tempTextarea);
          tempTextarea.val(textToCopy).select();
          document.execCommand("copy");
          if(isWeChatBrowser()){
             alert("已选物品链接已复制到您的剪切板，请在微信中将其发送给我！");

          }else{
             alert("已选物品链接已复制到您的剪切板，请在微信或WhatsApp中将其发送给我！");

          }   
          tempTextarea.remove();
        } catch (err) {
          console.error("Copy failed: " + err);
        } 
      }
      
    });
  
  

  $("#whatsapp").click(function () {
    window.open("https://api.whatsapp.com/send?phone=31620727621");
  });
  $("#wechat").click(function () {
    window.open("weixin://");
  });


  if (isWeChatBrowser()) {
    $("#whatsapp").hide();
    $("#wechat").hide();
    $(".ibox2").css("height", "110px");
    $(".wxhide").hide();
    $(".wxshow").show();
    $("body").css("background-color", "#ededed");
    $(".navbar").css("background-color", "#ededed");
    $(".body-content").css("background-color", "#ededed");
    $(".graylist").css("background", "#ededed");
    $(".bluelist").css("background", "#ededed");
    $("#wxibox2").attr("height", "120px");
    $("#wxibox2").attr(
      "src",
      "https://cdn.glitch.global/f1c7b686-0e39-43f2-8186-adb49d7f1137/wxwechat.png?v=1691593200541"
    );
  }
  // 微信内打开
  function isWeChatBrowser() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return userAgent.includes("micromessenger");
  }
  
  // 当用户滚动超过 100px 时，显示按钮
  $(window).scroll(function(){
    if(window.innerWidth < 1366){
      if ($(this).scrollTop() > 100) {
        $('.popBtnss').fadeIn();
      } else {
        $('.popBtnss').fadeOut();
      }  
    }else{
      if ($(this).scrollTop() > 100 ) {
        $('.popBtn').fadeIn();
      } else {
        $('.popBtn').fadeOut();
      } 
    }

  });

  // 当用户点击按钮时，滚动回页面顶部
  $('.upb').click(function(){
    $('html, body').animate({scrollTop : 0},100);
    return false;
  });
  $('.downb').click(function(){
    stopLoad = true;
    var targetElement = document.getElementById("downside");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(function () {
      stopLoad = false;
    }, 2000);  
    setTimeout(function () {
      $('.popBtnss').fadeOut();
    }, 1000); 
  });
  $("#downBtnss").hide();
  
  
});
