//
//  EtsyLoginVC.swift
//  Arti-Chat
//
//  Created by Komal Hirani on 11/21/16.
//  Copyright © 2016 Team Rick. All rights reserved.
//

import UIKit
import OAuthSwift

class EtsyLoginVC: UIViewController {

    @IBOutlet weak var etsyWebView: UIWebView!
    
    //Constants
    let etsyKey = "jq4x92ncxfk5tawous7dcaxm"
    let etsySecret = "5ywk81qg7d"
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
