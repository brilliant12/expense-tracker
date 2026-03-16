import java.util.Scanner;

class first{
   
    public void printTriangeStart(int num){
         int n=num;
        for(int i=1;i<=n;i++){
            for(int j=1;j<=i;j++){
                System.out.print("*");
            }
            System.out.println();
        }
    }
       public void printTriangeNumber(int num){
         int n=num;
        for(int i=1;i<=n;i++){
            for(int j=1;j<=i;j++){
                System.out.print(i);
            }
            System.out.println();
        }
    }
    public void printInvertedTriange(int num){
          int n=num;
        for(int i=1;i<=n;i++){
            for(int j=1;j<=n-i+1;j++){
                System.out.print(i);
            }
            System.out.println();
        }
    } 
    public String reverseString(String s){
        String result = "";
        for(int i=0;i<s.length();i++){
            result = s.charAt(i)+result;
        }
        return result;
    }
    public boolean palindromCheck(String s){
         String result = "";
        for(int i=0;i<s.length();i++){
            result = s.charAt(i)+result;
        }
        
        return s.equals(result);
    }

    public void vowelConsonantsCount(String s){
        int vowel_count=0;
          int cons_count=0;
        for(int i=0;i<s.length();i++){
                   if(s.charAt(i)=='a' || s.charAt(i)=='e'|| s.charAt(i)=='i' || s.charAt(i)=='o' || s.charAt(i)=='u' ){
                   vowel_count++;
                   }
                   else if(((int)s.charAt(i)>=65 && (int)s.charAt(i)<=91)  ||( (int)s.charAt(i)>=97 && (int)s.charAt(i)<=123)  )  {
                    cons_count++;
                   }
                }

                System.err.println("vowel Count"+vowel_count +" Consonants Count :"+cons_count);
    }
 

    public static void main(String[] args) {
        first obj=new first();
        Scanner input=new Scanner(System.in);
        int n=input.nextInt();
        obj.printTriangeNumber(n);
        obj.printTriangeStart(n);
        obj.printInvertedTriange(n);
        System.out.println(obj.reverseString("arjun gupta"));
         System.out.println(obj.palindromCheck("arjun gupta"));
         obj.vowelConsonantsCount("arjun gupta");
       } 
}